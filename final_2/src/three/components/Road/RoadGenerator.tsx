import { useMemo } from "react";
import type { RoadCluster } from "../../utils/clusteringAlgorithm";
import { GRID_CONFIG } from "../../config/grid";

interface RoadGeneratorProps {
  clusters: RoadCluster[];
  roadWidth?: number;
  roadColor?: string;
}

/**
 * 도로 생성 컴포넌트
 *
 * 클러스터 정보를 기반으로 도로 메시를 생성합니다.
 * InfiniteBackground GLSL에서 도로를 렌더링하므로,
 * 이 컴포넌트는 디버그 시각화용으로 사용됩니다.
 */
export function RoadGenerator({
  clusters,
  roadWidth = GRID_CONFIG.ROAD.WIDTH,
  roadColor = GRID_CONFIG.ROAD.COLOR,
}: RoadGeneratorProps) {
  // 도로 세그먼트 생성 (클러스터 바운딩 박스 기반)
  const roadSegments = useMemo(() => {
    const segments: Array<{
      position: [number, number, number];
      scale: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    clusters.forEach((cluster) => {
      // 클러스터 내 건물들로부터 바운딩 박스 계산
      if (cluster.buildings.length === 0) return;

      const cellSize = GRID_CONFIG.CELL_SIZE;
      let minX = Infinity,
        maxX = -Infinity;
      let minZ = Infinity,
        maxZ = -Infinity;

      for (const building of cluster.buildings) {
        const wx = building.x * cellSize;
        const wz = building.z * cellSize;
        minX = Math.min(minX, wx);
        maxX = Math.max(maxX, wx + cellSize);
        minZ = Math.min(minZ, wz);
        maxZ = Math.max(maxZ, wz + cellSize);
      }

      const halfWidth = roadWidth / 2;
      const y = 0.01; // 바닥 위 약간 띄움

      // 상단 도로 (minZ)
      segments.push({
        position: [(minX + maxX) / 2, y, minZ - halfWidth],
        scale: [maxX - minX + roadWidth, 0.1, roadWidth],
        rotation: [0, 0, 0],
      });

      // 하단 도로 (maxZ)
      segments.push({
        position: [(minX + maxX) / 2, y, maxZ + halfWidth],
        scale: [maxX - minX + roadWidth, 0.1, roadWidth],
        rotation: [0, 0, 0],
      });

      // 좌측 도로 (minX)
      segments.push({
        position: [minX - halfWidth, y, (minZ + maxZ) / 2],
        scale: [roadWidth, 0.1, maxZ - minZ + roadWidth],
        rotation: [0, 0, 0],
      });

      // 우측 도로 (maxX)
      segments.push({
        position: [maxX + halfWidth, y, (minZ + maxZ) / 2],
        scale: [roadWidth, 0.1, maxZ - minZ + roadWidth],
        rotation: [0, 0, 0],
      });
    });

    return segments;
  }, [clusters, roadWidth]);

  // 디버그 모드에서만 메시 렌더링 (실제로는 GLSL에서 처리)
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <group name="road-debug">
      {roadSegments.map((segment, index) => (
        <mesh
          key={`road-segment-${index}`}
          position={segment.position}
          scale={segment.scale}
          rotation={segment.rotation}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={roadColor} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
