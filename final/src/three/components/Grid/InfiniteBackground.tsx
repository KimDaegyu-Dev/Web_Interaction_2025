import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
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
uniform sampler2D uDataTexture;
uniform float uTextureSize;
uniform vec2 uClickPos;
uniform float uClickTime;
uniform float uTime;

varying vec2 vWorldPos;

${jigsawFunctions}

void main() {
  // 1. Jigsaw Pattern
  // Use world position directly (no rotation)
  // Scale UV by 2.0 to match 1 piece = 1 grid cell
  vec2 uv = vWorldPos / uGridSize * 2.0;
  
  // Get piece ID and distance to edge
  vec3 jig = jigsaw(uv);
  vec2 pieceID = jig.xy;
  float dist = jig.z;
  
  // --- Data Texture Lookup ---
  // pieceID is roughly integer + 0.5 (scaled space)
  // Map to integer grid coordinates
  // Formula: floor((pieceID + 0.5) / 2.0)
  vec2 gridCoord = floor((pieceID + 0.5) / 2.0);
  
  // Map gridCoord to Texture UV (0.5 offset to sample center of texel)
  vec2 texUV = (gridCoord + vec2(uTextureSize * 0.5) + 0.5) / uTextureSize;
  
  float state = texture2D(uDataTexture, texUV).r;
  
  // Pastel Colors (Fabrice's palette from user code)
  // h21 is defined in jigsawFunctions
  vec3 baseColor = .8 + .2*cos(6.3*h21(pieceID) + vec3(0, 23, 21));
  
  // If state is 0 (empty), make it white
  if (state < 0.5) {
      baseColor = vec3(0.95, 0.95, 0.95);
  }
  
  // --- Mouse Logic Optimization ---
  float isHovered = 0.0;
  
  // Mouse position in UV space
  vec2 mouseUv = uHoveredWorldPos / uGridSize * 2.0;

  // 간단한 거리 체크로 먼 곳은 계산 생략 (Branching optimization)
  if (uHoveredWorldPos.x > -9000.0 && distance(vWorldPos, uHoveredWorldPos) < uGridSize * 1.5) {
      vec3 mouseJig = jigsaw(mouseUv);
      vec2 mousePieceID = mouseJig.xy;
      
      // ID 매칭 확인
      isHovered = 1.0 - step(0.01, length(pieceID - mousePieceID));
  }

  // --- Click Animation (Ripple/Pop) ---
  float clickEffect = 0.0;
  if (uClickTime > 0.0) {
      float timeSinceClick = uTime - uClickTime;
      if (timeSinceClick < 1.0) { // Effect lasts 1 second
          float distToClick = distance(vWorldPos, uClickPos);
          float wave = sin(distToClick * 0.2 - timeSinceClick * 10.0);
          float mask = smoothstep(100.0, 0.0, distToClick); // Radius of effect
          clickEffect = mask * wave * exp(-timeSinceClick * 3.0);
      }
  }

  // --- Coloring ---
  float bevel = mix(
    smoothstep(0.0, 0.3, dist),
    smoothstep(0.0, 0.5, dist),
    isHovered
  );
  
  baseColor = mix(baseColor, baseColor * 1.2, isHovered);
  
  // Apply click effect to color
  baseColor += vec3(clickEffect * 0.2);
  
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
  lastClickEvent?: { x: number; z: number; time: number } | null;
}

const TEXTURE_SIZE = 1024;
const TEXTURE_OFFSET = TEXTURE_SIZE / 2;

export function InfiniteBackground({ objects = [], hoveredCell, lastClickEvent }: InfiniteBackgroundProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Controls for Oblique Matrix
  const projectionParams = useProjectionControls();
  const { getPanOffset } = useObliqueControls();
  
  // Refs for click animation
  const lastClickTimeRef = useRef<number>(0);
  const prevClickEventRef = useRef<{ x: number; z: number; time: number } | null>(null);

  // Data Texture Setup
  const dataTexture = useMemo(() => {
    const data = new Uint8Array(TEXTURE_SIZE * TEXTURE_SIZE);
    const texture = new THREE.DataTexture(
      data,
      TEXTURE_SIZE,
      TEXTURE_SIZE,
      THREE.RedFormat,
      THREE.UnsignedByteType
    );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Update Texture when objects change
  useEffect(() => {
    const data = dataTexture.image.data;
    data.fill(0); // Reset
    
    objects.forEach(obj => {
        // obj.position is World Position
        // Map to grid coords directly (no rotation)
        const gx = Math.round(obj.position[0] / GRID_CONFIG.CELL_SIZE);
        const gy = Math.round(obj.position[2] / GRID_CONFIG.CELL_SIZE);
        
        const tx = gx + TEXTURE_OFFSET;
        const ty = gy + TEXTURE_OFFSET;
        
        if (tx >= 0 && tx < TEXTURE_SIZE && ty >= 0 && ty < TEXTURE_SIZE) {
            const index = ty * TEXTURE_SIZE + tx;
            data[index] = 255; // Mark as occupied
        }
    });
    
    dataTexture.needsUpdate = true;
  }, [objects, dataTexture]);

  const uniforms = useMemo(
    () => ({
      uGridSize: { value: GRID_CONFIG.CELL_SIZE },
      uHoveredWorldPos: { value: new THREE.Vector2(-9999, -9999) },
      uDataTexture: { value: dataTexture },
      uTextureSize: { value: TEXTURE_SIZE },
      uClickPos: { value: new THREE.Vector2(-9999, -9999) },
      uClickTime: { value: -100.0 }, // Initialize to negative so no effect at start
      uTime: { value: 0 },
    }),
    [dataTexture]
  );

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;
    
    // 1. Calculate Oblique Matrix
    const panOffset = getPanOffset();
    const obliqueMatrix = calculateObliqueMatrix(projectionParams, panOffset);
    
    // 2. Apply to Mesh (Floor Plane)
    const floorMatrix = obliqueMatrix.clone();
    
    // Swap column 1 (Y) and column 2 (Z)
    const te = floorMatrix.elements;
    const temp4 = te[4]; te[4] = te[8]; te[8] = temp4;
    const temp5 = te[5]; te[5] = te[9]; te[9] = temp5;
    const temp6 = te[6]; te[6] = te[10]; te[10] = temp6;
    const temp7 = te[7]; te[7] = te[11]; te[11] = temp7;
    
    meshRef.current.matrix.copy(floorMatrix);
    meshRef.current.matrixWorldNeedsUpdate = true;

    // Update Uniforms
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    if (hoveredCell) {
        materialRef.current.uniforms.uHoveredWorldPos.value.set(hoveredCell.x, hoveredCell.z);
    } else {
        materialRef.current.uniforms.uHoveredWorldPos.value.set(-9999, -9999);
    }
    
    // Handle Click Event
    if (lastClickEvent && lastClickEvent !== prevClickEventRef.current) {
        prevClickEventRef.current = lastClickEvent;
        // Set click time to current shader time
        materialRef.current.uniforms.uClickTime.value = state.clock.elapsedTime;
        materialRef.current.uniforms.uClickPos.value.set(lastClickEvent.x, lastClickEvent.z);
    }
  });

  return (
    <mesh 
      ref={meshRef}
      frustumCulled={false} 
      matrixAutoUpdate={false}
    >
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
