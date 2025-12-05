import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GRID_CONFIG } from "../../config/grid";
import { calculateObliqueMatrix } from "../../utils/projection";
import type { CursorPosition, PlacedObject, ProjectionParams } from "../../config/types";
import type { RoadSegment } from "../../utils/clusteringAlgorithm";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Force full-screen quad at far plane (z=0.999 in NDC)
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;const fragmentShader = `
precision highp float;

uniform mat4 uInverseViewProj;
uniform mat4 uInverseOblique;
uniform float uGridSize;
uniform float uTime;

// 건물 위치 (Glow 효과용)
uniform vec3 uBuildingPositions[50];
uniform int uBuildingCount;

// 커서
uniform vec3 uCursorPositions[50];
uniform int uCursorCount;

// 도로
uniform vec4 uRoadSegments[150];
uniform int uRoadSegmentCount;

uniform float uInfluenceRadius;
uniform float uRoadWidth;
uniform vec3 uRoadColor;

varying vec2 vUv;

// 그라데이션
vec4 getGradientColor(vec2 worldPos, vec2 centerPos, float maxDist, float weight) {
  float dist = length(worldPos - centerPos) / maxDist;
  
  vec3 color1 = vec3(0.95, 0.96, 0.98); 
  vec3 color2 = vec3(0.90, 0.92, 0.95); 
  vec3 color3 = vec3(0.85, 0.88, 0.92); 
  vec3 color4 = vec3(0.80, 0.82, 0.85); 
  
  float t1 = smoothstep(0.0, 0.3, dist);
  float t2 = smoothstep(0.3, 0.6, dist);
  float t3 = smoothstep(0.6, 1.0, dist);
  
  vec3 color = mix(color1, color2, t1);
  color = mix(color, color3, t2);
  color = mix(color, color4, t3);
  
  float falloff = 1.0 - smoothstep(0.5, 1.0, dist);
  float normalizedWeight = min(weight / 3.0, 2.0);
  
  return vec4(color, falloff * normalizedWeight);
}

// 그리드 라인 그리기
float gridLine(vec2 pos, float lineWidth) {
  vec2 grid = abs(fract(pos - 0.5) - 0.5) / fwidth(pos);
  float line = min(grid.x, grid.y);
  return 1.0 - min(line / lineWidth, 1.0);
}

// 도로 거리 계산
float distToSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// 도로 라인 그리기
float roadSegmentLine(vec2 worldPos, vec4 segment, float roadWidth) {
  vec2 a = vec2(segment.x, segment.y);
  vec2 b = vec2(segment.z, segment.w);
  if (length(b - a) < 0.001) return 0.0;
  
  float dist = distToSegment(worldPos, a, b);
  float halfWidth = roadWidth * 0.35; // 도로 두께 약간 조정
  float aa = fwidth(dist);
  
  return 1.0 - smoothstep(halfWidth - aa, halfWidth + aa, dist);
}

void main() {
  // --- 좌표 계산 ---
  vec2 ndc = vUv * 2.0 - 1.0;
  vec4 ndcNear = vec4(ndc, -1.0, 1.0);
  vec4 ndcFar = vec4(ndc, 1.0, 1.0);
  vec4 worldNear = uInverseViewProj * ndcNear;
  vec4 worldFar = uInverseViewProj * ndcFar;
  worldNear /= worldNear.w;
  worldFar /= worldFar.w;
  vec3 rayOrigin = worldNear.xyz;
  vec3 rayDir = normalize(worldFar.xyz - worldNear.xyz);
  vec4 realOrigin4 = uInverseOblique * vec4(rayOrigin, 1.0);
  vec3 realOrigin = realOrigin4.xyz / realOrigin4.w;
  vec4 realDir4 = uInverseOblique * vec4(rayDir, 0.0);
  vec3 realDir = normalize(realDir4.xyz);
  float t = -realOrigin.y / realDir.y;
  if (t < 0.0) discard;
  vec3 intersectPoint = realOrigin + realDir * t;
  vec2 worldPos = intersectPoint.xz;

  // --- 1. 배경 그라데이션 ---
  vec3 baseColor = vec3(0.96, 0.96, 0.96); 
  vec3 finalGradient = baseColor;
  float minDistToLight = 1000.0;
  
  // 커서
  for (int i = 0; i < 50; i++) {
    if (i >= uCursorCount) break;
    vec2 cursorPos = uCursorPositions[i].xz;
    float distToCursor = length(worldPos - cursorPos);
    minDistToLight = min(minDistToLight, distToCursor);
    if (distToCursor < uInfluenceRadius) {
      vec4 gradient = getGradientColor(worldPos, cursorPos, uInfluenceRadius, 1.0);
      finalGradient = mix(finalGradient, gradient.rgb, gradient.a * 0.6);
    }
  }
  
  // 건물 주변 Glow (마스킹 대신 분위기만 유지)
  for (int i = 0; i < 50; i++) {
    if (i >= uBuildingCount) break;
    vec2 buildingPos = uBuildingPositions[i].xz;
    float distToBuilding = length(worldPos - buildingPos);
    minDistToLight = min(minDistToLight, distToBuilding);
    if (distToBuilding < uInfluenceRadius) {
      float weight = uBuildingPositions[i].y;
      vec4 gradient = getGradientColor(worldPos, buildingPos, uInfluenceRadius, weight);
      finalGradient = mix(finalGradient, gradient.rgb, gradient.a * 0.4);
    }
  }
  
  finalGradient = clamp(finalGradient, vec3(0.0), vec3(1.0));
  
  // --- 2. 그리드 렌더링 (핵심 변경: 1x1 스케일) ---
  float grid = 0.0;
  float distFade = 1.0 - smoothstep(5.0, 50.0, minDistToLight);
  
  if (distFade > 0.01) {
    // [중요] * 2.0을 제거했습니다. 이제 그리드는 건물 셀 크기와 1:1로 매칭됩니다.
    // 건물 내부를 가로지르는 십자선이 사라지고, 건물 외곽선에만 그리드가 그려집니다.
    vec2 gridUv = worldPos / uGridSize; 
    
    grid = gridLine(gridUv, 1.0) * distFade * 0.3;
  }
  
  vec3 gridColor = vec3(0.75, 0.75, 0.8); // 연한 회색 그리드
  vec3 finalColor = finalGradient + gridColor * grid;
  
  // --- 3. 도로 렌더링 ---
  float roadIntensity = 0.0;
  for (int i = 0; i < 150; i++) {
    if (i >= uRoadSegmentCount) break;
    roadIntensity = max(roadIntensity, roadSegmentLine(worldPos, uRoadSegments[i], uRoadWidth));
  }
  
  // 도로는 그리드 위에 진하게 덮어씁니다.
  vec3 posterRoadColor = vec3(0.2, 0.2, 0.25); 
  finalColor = mix(finalColor, posterRoadColor, roadIntensity);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface InfiniteBackgroundProps {
  buildings?: PlacedObject[];
  cursors?: CursorPosition[];
  myCursor?: { gridX: number; gridZ: number } | null;
  roadSegments?: RoadSegment[];
  projectionParams: ProjectionParams;
  getPanOffset: () => THREE.Vector3;
}

/**
 * 무한 배경 + 도로 렌더링 컴포넌트
 * Full-Screen Quad (FSQ) GLSL 셰이더 방식으로 최적화
 */
export function InfiniteBackground({
  buildings = [],
  cursors = [],
  myCursor = null,
  roadSegments = [],
  projectionParams,
  getPanOffset,
}: InfiniteBackgroundProps) {
  const { camera, gl, clock } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uInverseViewProj: { value: new THREE.Matrix4() },
      uInverseOblique: { value: new THREE.Matrix4() },
      uGridSize: { value: GRID_CONFIG.CELL_SIZE  },
      uTime: { value: 0 },
      uBuildingPositions: {
        value: Array.from({ length: 50 }, () => new THREE.Vector3(0, 0, 0)),
      },
      uBuildingCount: { value: 0 },
      uCursorPositions: {
        value: Array.from({ length: 50 }, () => new THREE.Vector3(0, 0, 0)),
      },
      uCursorCount: { value: 0 },
      uRoadSegments: {
        value: Array.from({ length: 150 }, () => new THREE.Vector4(0, 0, 0, 0)),
      },
      uRoadSegmentCount: { value: 0 },
      uInfluenceRadius: { value: GRID_CONFIG.CURSOR_INFLUENCE_RADIUS },
      uRoadWidth: { value: GRID_CONFIG.ROAD.WIDTH },
      uRoadColor: { value: new THREE.Color(GRID_CONFIG.ROAD.COLOR) },
    }),
    [],
  );

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempObliqueMatrix = useMemo(() => new THREE.Matrix4(), []);

  // 건물 클러스터링 (공간 해싱)
  useEffect(() => {
    if (!materialRef.current) return;

    const CLUSTER_SIZE = 10;
    const clusterMap = new Map<string, { buildings: typeof buildings; count: number }>();

    buildings.forEach((building) => {
      const clusterX = Math.floor(building.position[0] / CLUSTER_SIZE);
      const clusterZ = Math.floor(building.position[2] / CLUSTER_SIZE);
      const key = `${clusterX},${clusterZ}`;

      if (!clusterMap.has(key)) {
        clusterMap.set(key, { buildings: [], count: 0 });
      }
      clusterMap.get(key)!.buildings.push(building);
    });

    const clusters = Array.from(clusterMap.values()).map((cluster) => {
      const avgX = cluster.buildings.reduce((sum, b) => sum + b.position[0], 0) / cluster.buildings.length;
      const avgZ = cluster.buildings.reduce((sum, b) => sum + b.position[2], 0) / cluster.buildings.length;
      return new THREE.Vector3(avgX, cluster.buildings.length, avgZ);
    });

    while (clusters.length < 50) {
      clusters.push(new THREE.Vector3(0, 0, 0));
    }

    materialRef.current.uniforms.uBuildingPositions.value = clusters.slice(0, 50);
    materialRef.current.uniforms.uBuildingCount.value = Math.min(clusterMap.size, 50);
  }, [buildings]);

  // 커서 위치 업데이트 (GSAP 애니메이션)
  useEffect(() => {
    if (!materialRef.current) return;

    const allCursors = [...cursors];
    if (myCursor) {
      allCursors.push({
        userId: "me",
        gridX: myCursor.gridX,
        gridZ: myCursor.gridZ,
        color: "#ffffff",
      });
    }

    const targetPositions = allCursors
      .slice(0, 50)
      .map((cursor) => new THREE.Vector3(cursor.gridX, 0, cursor.gridZ));

    const currentPositions = materialRef.current.uniforms.uCursorPositions.value;

    targetPositions.forEach((targetPos, index) => {
      if (currentPositions[index]) {
        const current = currentPositions[index];
        if (current.x !== targetPos.x || current.z !== targetPos.z) {
          gsap.to(current, {
            x: targetPos.x,
            z: targetPos.z,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
          });
        }
      }
    });

    materialRef.current.uniforms.uCursorCount.value = Math.min(allCursors.length, 50);
  }, [cursors, myCursor]);

  // 도로 선분 업데이트
  useEffect(() => {
    if (!materialRef.current) return;

    const segments = roadSegments.slice(0, 150).map(
      (segment) => new THREE.Vector4(segment.x1, segment.z1, segment.x2, segment.z2)
    );

    while (segments.length < 150) {
      segments.push(new THREE.Vector4(0, 0, 0, 0));
    }

    materialRef.current.uniforms.uRoadSegments.value = segments;
    materialRef.current.uniforms.uRoadSegmentCount.value = Math.min(roadSegments.length, 150);
  }, [roadSegments]);

  // 렌더링 직전에 카메라 행렬 동기화
  useFrame(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();

    // 카메라 행렬이 유효한지 확인
    if (!camera.projectionMatrix || !camera.matrixWorldInverse) return;

    // 카메라의 실제 행렬 사용 (Three.js가 이미 계산한 값)
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();

    // ViewProjection = Projection * View(matrixWorldInverse)
    tempMatrix
      .copy(camera.projectionMatrix)
      .multiply(camera.matrixWorldInverse);
    
    // 행렬이 유효한지 확인 (determinant가 0이 아닌지)
    const det = tempMatrix.determinant();
    if (Math.abs(det) < 1e-10) return;
    
    // InverseViewProjection 계산
    materialRef.current.uniforms.uInverseViewProj.value
      .copy(tempMatrix)
      .invert();

    // Oblique 역행렬 계산 (panOffset 반영)
    const panOffset = getPanOffset();
    const obliqueMatrix = calculateObliqueMatrix(projectionParams, panOffset);
    tempObliqueMatrix.copy(obliqueMatrix).invert();
    materialRef.current.uniforms.uInverseOblique.value.copy(tempObliqueMatrix);
  }); 

  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
