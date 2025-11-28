import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { calculateObliqueMatrix } from "../../utils/projection";
import { useProjectionControls } from "../../hooks/useProjectionControls";
import { useObliqueControls } from "../../hooks/useObliqueControls";
import { GRID_CONFIG } from "../../config/grid";
import { jigsawFunctions } from "../../shaders/jigsaw.glsl";
import type { PlacedObject } from "../../hooks/useGridInteraction";

// 1. Vertex Shader: 복잡한 역변환 없이 월드 좌표를 바로 넘겨줍니다.
const vertexShader = `
varying vec2 vWorldPos; // x, z 좌표만 있으면 됨

void main() {
  // Use local position for pattern generation to avoid oblique distortion
  // Mesh is on XY plane, and we map Mesh Y -> World Z via matrix swapping
  // So position.xy corresponds to World XZ
  vWorldPos = position.xy;
  
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

// 2. Fragment Shader: 레이캐스팅 로직 제거
const fragmentShader = `
precision mediump float;

uniform float uGridSize;
uniform vec2 uHoveredWorldPos;

varying vec2 vWorldPos;

${jigsawFunctions}

void main() {
  // Raycasting 로직 삭제됨 -> vWorldPos 바로 사용
  
  // 1. Jigsaw Pattern
  vec2 uv = vWorldPos / uGridSize;
  
  // Get piece ID and distance to edge
  vec3 jig = jigsaw(uv);
  vec2 pieceID = jig.xy;
  float dist = jig.z;
  
  // Pastel Colors (Fabrice's palette from user code)
  // h21 is defined in jigsawFunctions
  vec3 baseColor = .8 + .2*cos(6.3*h21(pieceID) + vec3(0, 23, 21));
  
  // --- Mouse Logic Optimization ---
  // 마우스 위치에 대한 jigsaw 연산도 무겁다면, 
  // JS에서 미리 계산된 ID를 넘겨주는 것이 가장 좋으나,
  // 여기서는 마우스가 유효한 경우에만 계산하도록 최적화할 수 있습니다.
  
  float isHovered = 0.0;
  
  // 간단한 거리 체크로 먼 곳은 계산 생략 (Branching optimization)
  // 마우스와 현재 픽셀의 월드 거리가 그리드 사이즈의 2배 이내일 때만 정밀 검사
  if (uHoveredWorldPos.x > -9000.0 && distance(vWorldPos, uHoveredWorldPos) < uGridSize * 1.5) {
      vec2 mouseUv = uHoveredWorldPos / uGridSize;
      vec3 mouseJig = jigsaw(mouseUv);
      vec2 mousePieceID = mouseJig.xy;
      
      // ID 매칭 확인
      isHovered = 1.0 - step(0.01, length(pieceID - mousePieceID));
  }

  // --- Coloring (기존과 동일) ---
  float bevel = mix(
    smoothstep(0.0, 0.3, dist),
    smoothstep(0.0, 0.5, dist),
    isHovered
  );
  
  baseColor = mix(baseColor, baseColor * 1.2, isHovered);
  vec3 finalColor = baseColor * (0.7 + 0.3 * bevel);
  
  float outline = smoothstep(0.0, 0.02, dist);
  finalColor *= (0.4 + 0.6 * outline);

  finalColor += vec3(0.1) * isHovered;
  
  float b = dot(finalColor, vec3(0.333));
  finalColor = vec3(b) + (finalColor - vec3(b)) * 1.2;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface InfiniteBackgroundProps {
  objects?: PlacedObject[];
  hoveredCell?: { x: number; z: number } | null;
}

export function InfiniteBackground({ objects = [], hoveredCell }: InfiniteBackgroundProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Controls for Oblique Matrix
  const projectionParams = useProjectionControls();
  const { getPanOffset } = useObliqueControls();

  const uniforms = useMemo(
    () => ({
      uGridSize: { value: GRID_CONFIG.CELL_SIZE * 4.0 },
      uHoveredWorldPos: { value: new THREE.Vector2(-9999, -9999) },
    }),
    []
  );

  useFrame(() => {
    if (!materialRef.current || !meshRef.current) return;
    
    // 1. Calculate Oblique Matrix
    const panOffset = getPanOffset();
    const obliqueMatrix = calculateObliqueMatrix(projectionParams, panOffset);
    
    // 2. Apply to Mesh (Floor Plane)
    // The mesh geometry is on XY plane. We want it to represent the XZ floor.
    // So we need to map Mesh X -> World X, Mesh Y -> World Z.
    // We do this by swapping the Y and Z columns of the oblique matrix.
    const floorMatrix = obliqueMatrix.clone();
    
    // Swap column 1 (Y) and column 2 (Z)
    // Column 1 elements: 4, 5, 6, 7
    // Column 2 elements: 8, 9, 10, 11
    const te = floorMatrix.elements;
    const temp4 = te[4]; te[4] = te[8]; te[8] = temp4;
    const temp5 = te[5]; te[5] = te[9]; te[9] = temp5;
    const temp6 = te[6]; te[6] = te[10]; te[10] = temp6;
    const temp7 = te[7]; te[7] = te[11]; te[11] = temp7;
    
    meshRef.current.matrix.copy(floorMatrix);
    meshRef.current.matrixWorldNeedsUpdate = true;

    if (hoveredCell) {
        materialRef.current.uniforms.uHoveredWorldPos.value.set(hoveredCell.x, hoveredCell.z);
    } else {
        materialRef.current.uniforms.uHoveredWorldPos.value.set(-9999, -9999);
    }
  });

  return (
    // frustumCulled={false}는 유지하되, Full Screen Quad 대신 큰 평면 사용
    // matrixAutoUpdate={false}를 설정하여 수동으로 행렬을 제어
    <mesh 
      ref={meshRef}
      frustumCulled={false} 
      matrixAutoUpdate={false}
    >
      {/* 카메라가 이동하는 범위에 맞춰 충분히 큰 평면을 생성합니다. */}
      <planeGeometry args={[1000, 1000]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
