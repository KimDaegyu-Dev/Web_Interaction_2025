import { useMemo, useEffect, useState } from "react";
import {
  calculateRoadNetwork,
  roadSegmentsToShaderFormat,
  type RoadNetwork,
  type RoadSegment,
} from "../utils/clusteringAlgorithm";
import type { PlacedObject } from "../config/types";

interface UseRoadClusteringResult {
  /** 전체 도로 네트워크 정보 */
  network: RoadNetwork;
  /** 셰이더에 전달할 도로 선분 목록 */
  roadSegments: RoadSegment[];
  /** 셰이더 Uniform용 Float32Array */
  shaderData: Float32Array;
  /** 클러스터 개수 */
  clusterCount: number;
  /** 전체 도로 선분 개수 */
  segmentCount: number;
}

/**
 * 도로 클러스터링 훅 (개선된 버전)
 *
 * 건물 목록을 받아 도로 네트워크를 계산합니다.
 * - Manhattan Distance 기반 클러스터링
 * - 클러스터 경계선(perimeter) 추출
 * - MST(최소 신장 트리)로 클러스터 간 연결
 *
 * @param buildings 건물 목록
 * @returns 도로 네트워크 정보 및 셰이더 데이터
 */
export function useRoadClustering(
  buildings: PlacedObject[]
): UseRoadClusteringResult {
  const [network, setNetwork] = useState<RoadNetwork>({
    clusters: [],
    mstEdges: [],
    allRoadSegments: [],
  });

  // 건물 목록이 변경될 때마다 도로 네트워크 재계산
  useEffect(() => {
    const newNetwork = calculateRoadNetwork(buildings);
    setNetwork(newNetwork);

    console.log(
      `[RoadClustering] Recalculated: ${newNetwork.clusters.length} clusters, ` +
        `${newNetwork.allRoadSegments.length} road segments (perimeter: ${
          newNetwork.allRoadSegments.length - newNetwork.mstEdges.length
        }, MST: ${newNetwork.mstEdges.length}) from ${
          buildings.length
        } buildings`
    );
  }, [buildings]);

  // 셰이더 전달용 데이터 생성
  const shaderData = useMemo(() => {
    return roadSegmentsToShaderFormat(network.allRoadSegments);
  }, [network.allRoadSegments]);

  return {
    network,
    roadSegments: network.allRoadSegments,
    shaderData,
    clusterCount: network.clusters.length,
    segmentCount: network.allRoadSegments.length,
  };
}
