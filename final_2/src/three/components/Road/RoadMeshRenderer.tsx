import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { RoadSegment } from "../../utils/clusteringAlgorithm";

interface RoadMeshRendererProps {
  roadSegments: RoadSegment[];
  isDarkMode?: boolean;
  maxSegments?: number; // 성능을 위해 제한
}

/**
 * 도로를 실제 3D 메시로 렌더링하는 컴포넌트
 *
 * 장점:
 * - GPU가 자동으로 frustum culling 수행
 * - 거리 기반 LOD 자동 적용
 * - Shader 루프 없이 효율적 렌더링
 * - InstancedMesh로 최적화 가능
 */
export function RoadMeshRenderer({
  roadSegments,
  isDarkMode = true,
  maxSegments = 500, // 성능 제한
}: RoadMeshRendererProps) {
  const groupRef = useRef<THREE.Group>(null);

  // 도로 메시 생성 (병합된 geometry)
  const roadGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    // 도로 색상 (더 명확하게)
    const roadColor = isDarkMode
      ? new THREE.Color(0.9, 0.9, 0.9) // 다크 모드: 밝은 회색 (배경과 대비)
      : new THREE.Color(0.3, 0.3, 0.35); // 라이트 모드: 어두운 회색

    const segments = roadSegments.slice(0, maxSegments);
    let vertexIndex = 0;

    segments.forEach((segment) => {
      const { x1, z1, x2, z2, width } = segment;
      const halfWidth = width * 0.5;
      const y = 0.0; // 바닥 레벨

      // 방향 벡터
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.sqrt(dx * dx + dz * dz);

      if (length < 0.001) return; // 너무 짧은 세그먼트 스킵

      // 정규화된 방향 벡터
      const dirX = dx / length;
      const dirZ = dz / length;

      // 수직 벡터 (도로 폭 방향) - normalized
      const perpX = -dirZ * halfWidth;
      const perpZ = dirX * halfWidth;

      // 연결 부분을 위해 양끝을 line-width만큼 확장
      const extendAmount = width / 2; // line-width만큼 확장
      const extendedX1 = x1 - dirX * extendAmount;
      const extendedZ1 = z1 - dirZ * extendAmount;
      const extendedX2 = x2 + dirX * extendAmount;
      const extendedZ2 = z2 + dirZ * extendAmount;

      // 4개 코너점 (사각형 생성, 확장된 끝점 사용)
      const p1 = [extendedX1 + perpX, y, extendedZ1 + perpZ];
      const p2 = [extendedX1 - perpX, y, extendedZ1 - perpZ];
      const p3 = [extendedX2 + perpX, y, extendedZ2 + perpZ];
      const p4 = [extendedX2 - perpX, y, extendedZ2 - perpZ];

      // 정점 추가
      positions.push(...p1, ...p2, ...p3, ...p4);

      // 인덱스 (두 개의 삼각형)
      indices.push(
        vertexIndex,
        vertexIndex + 1,
        vertexIndex + 2,
        vertexIndex + 1,
        vertexIndex + 3,
        vertexIndex + 2
      );

      // 색상
      colors.push(
        ...roadColor.toArray(),
        ...roadColor.toArray(),
        ...roadColor.toArray(),
        ...roadColor.toArray()
      );

      vertexIndex += 4;
    });

    if (positions.length === 0) {
      return null;
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setIndex(indices);
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    return geometry;
  }, [roadSegments, maxSegments, isDarkMode]);

  if (!roadGeometry) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <mesh
        geometry={roadGeometry}
        frustumCulled={true}
        renderOrder={1} // 건물 위에 렌더링
      >
        <meshBasicMaterial
          vertexColors={true}
          toneMapped={false}
          depthWrite={true}
          depthTest={true}
          side={THREE.DoubleSide} // 양면 렌더링
        />
      </mesh>
    </group>
  );
}
