import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GRID_CONFIG } from "../../config/grid";
import { calculateObliqueMatrix } from "../../utils/projection";
import {
  generateGradientTexture,
  calculateWorldBounds,
} from "../../utils/gradientTextureGenerator";
import type {
  CursorPosition,
  PlacedObject,
  ProjectionParams,
} from "../../config/types";
import { type RoadSegment } from "../../utils/clusteringAlgorithm";

// ... (previous imports)

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Force full-screen quad at far plane (z=0.999 in NDC)
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform mat4 uInverseViewProj;
uniform mat4 uInverseOblique;
uniform float uGridSize;
uniform float uTime;
uniform float uIsDarkMode; // 0.0 = Light, 1.0 = Dark

// 건물 위치 (Glow 효과용)
uniform vec3 uBuildingPositions[50];
uniform int uBuildingCount;

// 커서
uniform vec3 uCursorPositions[50];
uniform int uCursorCount;

// 도로
uniform sampler2D uRoadPositionTexture;
uniform sampler2D uRoadWidthTexture;
uniform int uRoadSegmentCount;

uniform float uInfluenceRadius;
uniform float uRoadWidth;
uniform vec3 uRoadColor; // Not used directly anymore, hardcoded per mode
uniform vec3 uCameraPosition; // Camera position for LOD
uniform float uRoadLODDistance; // LOD distance threshold
uniform float uEnableGradients; // 0.0 = disabled, 1.0 = enabled
uniform float uQuality; // 품질 배율 (0.75 = 낮음, 0.9 = 중간, 1.0 = 높음)

// 건물 그라데이션 텍스처 (미리 계산됨)
uniform sampler2D uBuildingGradientTexture;
uniform vec4 uGradientTextureBounds; // minX, maxX, minZ, maxZ
uniform float uGradientTextureSize;

varying vec2 vUv;

// 그라데이션
vec4 getGradientColor(vec2 worldPos, vec2 centerPos, float maxDist, float weight) {
  float dist = length(worldPos - centerPos) / maxDist;
  
  // Light Mode Colors
  vec3 l1 = vec3(0.95, 0.96, 0.98); 
  vec3 l2 = vec3(0.90, 0.92, 0.95); 
  vec3 l3 = vec3(0.85, 0.88, 0.92); 
  vec3 l4 = vec3(0.80, 0.82, 0.85);

  // Dark Mode Colors
  vec3 d1 = vec3(0.35, 0.36, 0.38); 
  vec3 d2 = vec3(0.30, 0.32, 0.35); 
  vec3 d3 = vec3(0.25, 0.28, 0.32); 
  vec3 d4 = vec3(0.20, 0.22, 0.25);

  vec3 color1 = mix(l1, d1, uIsDarkMode);
  vec3 color2 = mix(l2, d2, uIsDarkMode);
  vec3 color3 = mix(l3, d3, uIsDarkMode);
  vec3 color4 = mix(l4, d4, uIsDarkMode);
  
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

  // --- 1. 배경 설정 ---
  vec3 lightBase = vec3(0.96, 0.96, 0.96);
  vec3 darkBase = vec3(0.02, 0.02, 0.02);
  vec3 baseColor = mix(lightBase, darkBase, uIsDarkMode);
  
  vec3 finalGradient = baseColor;
  float minDistToLight = 1000.0;
  
  // 원형 그라데이션 (toggle 가능)
  if (uEnableGradients > 0.5) {
    // 1. 건물 그라데이션: 텍스처에서 샘플링 (미리 계산됨)
    vec2 gradientUv = vec2(
      (worldPos.x - uGradientTextureBounds.x) / (uGradientTextureBounds.y - uGradientTextureBounds.x),
      (worldPos.y - uGradientTextureBounds.z) / (uGradientTextureBounds.w - uGradientTextureBounds.z)
    );
    
    // 텍스처 범위 내에 있으면 샘플링
    if (gradientUv.x >= 0.0 && gradientUv.x <= 1.0 && gradientUv.y >= 0.0 && gradientUv.y <= 1.0) {
      vec4 buildingGradient = texture2D(uBuildingGradientTexture, gradientUv);
      finalGradient = mix(finalGradient, buildingGradient.rgb, buildingGradient.a);
      
      // minDistToLight 근사: 텍스처 알파값으로 거리 추정 (루프 제거로 성능 향상)
      // 알파값이 높을수록 건물에 가까움 → 거리가 짧음
      float estimatedDist = (1.0 - buildingGradient.a) * 100.0;
      minDistToLight = min(minDistToLight, estimatedDist);
    }
    
    // 2. 커서 그라데이션: 실시간 계산 (커서는 움직이므로)
    // 최적화: 제곱 거리로 먼저 체크하여 sqrt 계산 최소화
    float influenceRadiusSq = uInfluenceRadius * uInfluenceRadius;
    for (int i = 0; i < 50; i++) {
      if (i >= uCursorCount) break;
      vec2 cursorPos = uCursorPositions[i].xz;
      vec2 diff = worldPos - cursorPos;
      float distSq = dot(diff, diff);
      
      // Early exit: 영향 반경 밖이면 스킵 (sqrt 없이 체크)
      if (distSq >= influenceRadiusSq) {
        // minDistToLight 업데이트를 위해 sqrt 계산 (하지만 루프는 종료)
        float distToCursor = sqrt(distSq);
        minDistToLight = min(minDistToLight, distToCursor);
        continue;
      }
      
      // 영향 반경 내에 있으면 정확한 거리 계산 및 그라데이션 적용
      float distToCursor = sqrt(distSq);
      minDistToLight = min(minDistToLight, distToCursor);
      
      vec4 gradient = getGradientColor(worldPos, cursorPos, uInfluenceRadius, 1.0);
      finalGradient = mix(finalGradient, gradient.rgb, gradient.a * 0.6);
    }
  }
  
  finalGradient = clamp(finalGradient, vec3(0.0), vec3(1.0));
  
  // --- 2. 그리드 렌더링 (핵심 변경: 1x1 스케일) ---
  // 품질에 따라 거리 페이드 범위 조절 (낮은 품질일수록 더 가까운 거리만 렌더링)
  float fadeStart = 5.0 * uQuality;
  float fadeEnd = 50.0 * uQuality;
  float grid = 0.0;
  float distFade = 1.0 - smoothstep(fadeStart, fadeEnd, minDistToLight);
  
  if (distFade > 0.01) {
    vec2 gridUv = worldPos / uGridSize; 
    grid = gridLine(gridUv, 1.0) * distFade * 0.3;
  }
  
  vec3 lightGrid = vec3(0.75, 0.75, 0.8);
  vec3 darkGrid = vec3(0.15, 0.15, 0.2);
  vec3 gridColor = mix(lightGrid, darkGrid, uIsDarkMode);

  vec3 finalColor = finalGradient + gridColor * grid;
  
  // --- 3. 도로 렌더링 ---
  // 도로는 이제 별도의 3D 메시로 렌더링되므로 shader에서 제거
  // 이렇게 하면 GPU가 자동으로 frustum culling과 LOD를 처리
  
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
  isDarkMode?: boolean;
  enableGradients?: boolean; // 그라데이션 토글
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
  isDarkMode = true,
  enableGradients = true,
}: InfiniteBackgroundProps) {
  const { camera, clock } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 적응형 품질 시스템: FPS에 따라 품질 자동 조절

  const uniforms = useMemo(
    () => ({
      uInverseViewProj: { value: new THREE.Matrix4() },
      uInverseOblique: { value: new THREE.Matrix4() },
      uGridSize: { value: GRID_CONFIG.CELL_SIZE },
      uTime: { value: 0 },
      uIsDarkMode: { value: isDarkMode ? 1.0 : 0.0 }, // Initialize with prop
      uBuildingPositions: {
        value: Array.from({ length: 50 }, () => new THREE.Vector3(0, 0, 0)),
      },
      uBuildingCount: { value: 0 },
      uCursorPositions: {
        value: Array.from({ length: 50 }, () => new THREE.Vector3(0, 0, 0)),
      },
      uCursorCount: { value: 0 },
      // [변경] 도로 데이터를 텍스처로 전달 (Limit 150 -> 4096)
      uRoadPositionTexture: { value: null },
      uRoadWidthTexture: { value: null },
      uRoadSegmentCount: { value: 0 },
      uInfluenceRadius: { value: GRID_CONFIG.CURSOR_INFLUENCE_RADIUS },
      uRoadWidth: { value: GRID_CONFIG.ROAD.WIDTH },
      uRoadColor: { value: new THREE.Color(GRID_CONFIG.ROAD.COLOR) },
      uCameraPosition: { value: new THREE.Vector3() },
      uRoadLODDistance: { value: 80.0 }, // 카메라로부터 80 유닛 이내만 도로 렌더링
      uEnableGradients: { value: 1.0 }, // 그라데이션 활성화 (기본값: 활성화)
      uBuildingGradientTexture: { value: null },
      uGradientTextureBounds: { value: new THREE.Vector4(0, 0, 0, 0) }, // minX, maxX, minZ, maxZ
      uGradientTextureSize: { value: 512.0 },
      uQuality: { value: 1.0 }, // 품질 배율
    }),
    []
  );

  useEffect(() => {
    if (materialRef.current) {
      // Smooth transition for isDarkMode
      gsap.to(materialRef.current.uniforms.uIsDarkMode, {
        value: isDarkMode ? 1.0 : 0.0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (materialRef.current) {
      // Smooth transition for enableGradients
      gsap.to(materialRef.current.uniforms.uEnableGradients, {
        value: enableGradients ? 1.0 : 0.0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [enableGradients]);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempObliqueMatrix = useMemo(() => new THREE.Matrix4(), []);

  // 건물 그라데이션 텍스처 생성 (건물이 변경될 때만 재계산)
  const gradientTextureRef = useRef<THREE.DataTexture | null>(null);
  const worldBoundsRef = useRef<{
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  } | null>(null);

  // 동적 텍스처 해상도 계산: 건물 수와 월드 크기에 따라 조절
  const textureSize = useMemo(() => {
    if (buildings.length === 0) return 256;

    const bounds = calculateWorldBounds(buildings, 0); // 패딩 없이 크기만 계산
    const worldWidth = bounds.maxX - bounds.minX;
    const worldDepth = bounds.maxZ - bounds.minZ;
    const worldSize = Math.max(worldWidth, worldDepth);

    // 건물 수 기준 해상도
    let sizeByCount = 256;
    if (buildings.length >= 50) {
      sizeByCount = 1024;
    } else if (buildings.length >= 10) {
      sizeByCount = 512;
    }

    // 월드 크기 기준 해상도
    let sizeByWorld = 256;
    if (worldSize >= 300) {
      sizeByWorld = 1024;
    } else if (worldSize >= 100) {
      sizeByWorld = 512;
    }

    // 두 기준 중 큰 값 사용
    return Math.max(sizeByCount, sizeByWorld);
  }, [buildings]);

  // 품질 배율을 적용한 최종 텍스처 해상도
  const finalTextureSize = useMemo(() => {
    return Math.round(textureSize * 1.0);
  }, [textureSize]);

  useEffect(() => {
    if (!materialRef.current || buildings.length === 0) {
      // 건물이 없으면 텍스처 제거
      if (gradientTextureRef.current) {
        gradientTextureRef.current.dispose();
        gradientTextureRef.current = null;
      }
      if (materialRef.current) {
        materialRef.current.uniforms.uBuildingGradientTexture.value = null;
      }
      return;
    }

    // 월드 바운드 계산
    const bounds = calculateWorldBounds(buildings, 100); // 100 유닛 패딩
    worldBoundsRef.current = bounds;

    // 그라데이션 텍스처 생성 (비동기로 처리하여 메인 스레드 블로킹 방지)

    // 기존 텍스처 정리
    if (gradientTextureRef.current) {
      gradientTextureRef.current.dispose();
    }

    // Web Worker나 requestIdleCallback을 사용할 수도 있지만,
    // 일단 동기적으로 생성 (건물이 많지 않으면 괜찮음)
    const texture = generateGradientTexture(
      buildings,
      finalTextureSize,
      bounds,
      GRID_CONFIG.CURSOR_INFLUENCE_RADIUS,
      isDarkMode
    );

    gradientTextureRef.current = texture;

    // Uniform 업데이트
    if (materialRef.current) {
      materialRef.current.uniforms.uBuildingGradientTexture.value = texture;
      materialRef.current.uniforms.uGradientTextureBounds.value.set(
        bounds.minX,
        bounds.maxX,
        bounds.minZ,
        bounds.maxZ
      );
      materialRef.current.uniforms.uGradientTextureSize.value =
        finalTextureSize;
    }
  }, [buildings, isDarkMode, finalTextureSize]); // 건물이 변경되거나 다크모드가 변경될 때만 재계산

  // 텍스처 초기화 (64x64 = 4096개 도로 지원)
  const TEXTURE_SIZE = 64;
  const MAX_ROADS = TEXTURE_SIZE * TEXTURE_SIZE;

  // 데이터 텍스처 레퍼런스 유지
  const roadDataParams = useMemo(() => {
    const posData = new Float32Array(MAX_ROADS * 4); // RGBA
    const widthData = new Float32Array(MAX_ROADS * 1); // R

    const posTexture = new THREE.DataTexture(
      posData,
      TEXTURE_SIZE,
      TEXTURE_SIZE,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    posTexture.minFilter = THREE.NearestFilter;
    posTexture.magFilter = THREE.NearestFilter;
    posTexture.needsUpdate = true;

    const widthTexture = new THREE.DataTexture(
      widthData,
      TEXTURE_SIZE,
      TEXTURE_SIZE,
      THREE.RedFormat,
      THREE.FloatType
    );
    widthTexture.minFilter = THREE.NearestFilter;
    widthTexture.magFilter = THREE.NearestFilter;
    widthTexture.needsUpdate = true;

    return { posTexture, widthTexture, posData, widthData };
  }, []);

  // Uniform에 텍스처 연결
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uRoadPositionTexture.value =
      roadDataParams.posTexture;
    materialRef.current.uniforms.uRoadWidthTexture.value =
      roadDataParams.widthTexture;
  }, [roadDataParams]);

  // 건물 클러스터링 (공간 해싱)
  useEffect(() => {
    if (!materialRef.current) return;

    const CLUSTER_SIZE = 10;
    const clusterMap = new Map<
      string,
      { buildings: typeof buildings; count: number }
    >();

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
      const avgX =
        cluster.buildings.reduce((sum, b) => sum + b.position[0], 0) /
        cluster.buildings.length;
      const avgZ =
        cluster.buildings.reduce((sum, b) => sum + b.position[2], 0) /
        cluster.buildings.length;
      return new THREE.Vector3(avgX, cluster.buildings.length, avgZ);
    });

    while (clusters.length < 50) {
      clusters.push(new THREE.Vector3(0, 0, 0));
    }

    materialRef.current.uniforms.uBuildingPositions.value = clusters.slice(
      0,
      50
    );
    materialRef.current.uniforms.uBuildingCount.value = Math.min(
      clusterMap.size,
      50
    );
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

    const currentPositions =
      materialRef.current.uniforms.uCursorPositions.value;

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
            onUpdate: () => {
              // 필요한 경우 추가 로직
            },
          });
        }
      }
    });

    materialRef.current.uniforms.uCursorCount.value = Math.min(
      allCursors.length,
      50
    );
  }, [cursors, myCursor]);

  // 도로 선분 업데이트 (DataTexture 방식)
  useEffect(() => {
    if (!materialRef.current) return;

    const { posData, widthData, posTexture, widthTexture } = roadDataParams;
    const count = Math.min(roadSegments.length, MAX_ROADS);

    // 데이터 채우기
    for (let i = 0; i < count; i++) {
      const seg = roadSegments[i];
      posData[i * 4] = seg.x1;
      posData[i * 4 + 1] = seg.z1;
      posData[i * 4 + 2] = seg.x2;
      posData[i * 4 + 3] = seg.z2;

      // widths 텍스처는 RedFormat (1채널)
      widthData[i] = seg.width;
    }

    // 텍스처 업데이트 플래그 설정
    posTexture.needsUpdate = true;
    widthTexture.needsUpdate = true;

    materialRef.current.uniforms.uRoadSegmentCount.value = count;
  }, [roadSegments, roadDataParams]);

  // 렌더링 직전에 카메라 행렬 동기화
  useFrame(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();

    // 카메라 위치 업데이트 (LOD용)
    materialRef.current.uniforms.uCameraPosition.value.copy(camera.position);

    // 품질 배율 업데이트 (적응형 품질 시스템)
    materialRef.current.uniforms.uQuality.value = 2.0;

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
