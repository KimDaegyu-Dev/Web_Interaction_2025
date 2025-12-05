import { GRID_CONFIG } from "../config/grid";
import type { GridCell, PlacedObject } from "../config/types";

/**
 * 도로 선분 (그리드 엣지)
 * 두 점 (x1, z1) -> (x2, z2)를 연결하는 선분
 */
export interface RoadSegment {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  type: "perimeter" | "mst"; // 경계선 또는 MST 연결선
}

/**
 * 도로 클러스터 정보
 */
export interface RoadCluster {
  id: string;
  cells: GridCell[];
  centroid: GridCell;
  perimeterEdges: RoadSegment[];
}

/**
 * 전체 도로 네트워크
 */
export interface RoadNetwork {
  clusters: RoadCluster[];
  mstEdges: RoadSegment[];
  allRoadSegments: RoadSegment[];
}

/**
 * 레거시 호환용: 도로 클러스터 바운딩 박스
 * @deprecated RoadCluster를 사용하세요
 */
export interface RoadClusterBounds {
  id: string;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  buildingCount: number;
}

/**
 * Union-Find 자료구조 (Disjoint Set)
 * 클러스터링을 위한 효율적인 집합 연산
 */
class UnionFind {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();

  private getKey(cell: GridCell): string {
    return `${cell.x},${cell.z}`;
  }

  find(cell: GridCell): string {
    const key = this.getKey(cell);
    if (!this.parent.has(key)) {
      this.parent.set(key, key);
      this.rank.set(key, 0);
    }

    let root = key;
    while (this.parent.get(root) !== root) {
      root = this.parent.get(root)!;
    }

    // Path compression
    let current = key;
    while (current !== root) {
      const next = this.parent.get(current)!;
      this.parent.set(current, root);
      current = next;
    }

    return root;
  }

  union(cell1: GridCell, cell2: GridCell): void {
    const root1 = this.find(cell1);
    const root2 = this.find(cell2);

    if (root1 === root2) return;

    const rank1 = this.rank.get(root1) || 0;
    const rank2 = this.rank.get(root2) || 0;

    if (rank1 < rank2) {
      this.parent.set(root1, root2);
    } else if (rank1 > rank2) {
      this.parent.set(root2, root1);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, rank1 + 1);
    }
  }

  connected(cell1: GridCell, cell2: GridCell): boolean {
    return this.find(cell1) === this.find(cell2);
  }
}

/**
 * 건물 위치를 그리드 셀로 변환
 */
function positionToGridCell(position: [number, number, number]): GridCell {
  const cellSize = GRID_CONFIG.CELL_SIZE;
  return {
    x: Math.floor(position[0] / cellSize),
    z: Math.floor(position[2] / cellSize),
  };
}

/**
 * 그리드 셀을 월드 좌표로 변환 (셀의 중심점)
 */
function gridCellToWorld(cell: GridCell): { x: number; z: number } {
  const cellSize = GRID_CONFIG.CELL_SIZE;
  return {
    x: cell.x * cellSize + cellSize / 2,
    z: cell.z * cellSize + cellSize / 2,
  };
}

/**
 * 거리 기반 근접 규칙 (Manhattan Distance)
 * 기존 8방향 adjacency를 대체
 */
function areNearby(
  cell1: GridCell,
  cell2: GridCell,
  threshold: number = GRID_CONFIG.CLUSTER.NEAR_THRESHOLD
): boolean {
  const dx = Math.abs(cell1.x - cell2.x);
  const dz = Math.abs(cell1.z - cell2.z);
  return dx + dz <= threshold;
}

/**
 * 두 셀 간의 Manhattan 거리
 */
function manhattanDistance(cell1: GridCell, cell2: GridCell): number {
  return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.z - cell2.z);
}

/**
 * 클러스터가 크기 제한을 초과하는지 확인
 */
function exceedsClusterSize(cells: GridCell[]): boolean {
  if (cells.length === 0) return false;

  const minX = Math.min(...cells.map((c) => c.x));
  const maxX = Math.max(...cells.map((c) => c.x));
  const minZ = Math.min(...cells.map((c) => c.z));
  const maxZ = Math.max(...cells.map((c) => c.z));

  const width = maxX - minX + 1;
  const height = maxZ - minZ + 1;

  return (
    width > GRID_CONFIG.CLUSTER.MAX_WIDTH ||
    height > GRID_CONFIG.CLUSTER.MAX_HEIGHT
  );
}

/**
 * 클러스터의 중심점(centroid) 계산
 */
function calculateCentroid(cells: GridCell[]): GridCell {
  if (cells.length === 0) return { x: 0, z: 0 };

  const sumX = cells.reduce((sum, c) => sum + c.x, 0);
  const sumZ = cells.reduce((sum, c) => sum + c.z, 0);

  return {
    x: Math.round(sumX / cells.length),
    z: Math.round(sumZ / cells.length),
  };
}

/**
 * A* 알고리즘용 노드
 */
interface PathNode {
  x: number;
  z: number;
  f: number;
  g: number;
  h: number;
  parent: PathNode | null;
}

/**
 * A* 길찾기 알고리즘
 * 건물(occupied)을 피해서 경로를 생성합니다.
 */
function findPathAStar(
  start: GridCell,
  end: GridCell,
  occupiedCells: Set<string>,
  maxIterations: number = 500
): RoadSegment[] {
  const openSet: PathNode[] = [];
  const closedSet = new Set<string>();
  const cellSize = GRID_CONFIG.CELL_SIZE;

  // 시작 노드
  openSet.push({
    x: start.x,
    z: start.z,
    f: 0,
    g: 0,
    h: manhattanDistance(start, end),
    parent: null,
  });

  let iterations = 0;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;

    // f값이 가장 낮은 노드 선택
    let winner = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    const current = openSet[winner];

    // 목표 도달 시 경로 재구성
    if (current.x === end.x && current.z === end.z) {
      const path: RoadSegment[] = [];
      let temp: PathNode | null = current;

      while (temp && temp.parent) {
        const x1 = temp.parent.x * cellSize + cellSize / 2;
        const z1 = temp.parent.z * cellSize + cellSize / 2;
        const x2 = temp.x * cellSize + cellSize / 2;
        const z2 = temp.z * cellSize + cellSize / 2;

        path.push({ x1, z1, x2, z2, type: "mst" });
        temp = temp.parent;
      }
      return path;
    }

    // 현재 노드 처리
    openSet.splice(winner, 1);
    closedSet.add(`${current.x},${current.z}`);

    // 이웃 노드 탐색 (상하좌우 4방향)
    const neighbors = [
      { x: current.x + 1, z: current.z },
      { x: current.x - 1, z: current.z },
      { x: current.x, z: current.z + 1 },
      { x: current.x, z: current.z - 1 },
    ];

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.z}`;

      // start와 end는 건물이 있어도 허용
      const isStartOrEnd =
        (neighbor.x === start.x && neighbor.z === start.z) ||
        (neighbor.x === end.x && neighbor.z === end.z);

      if (closedSet.has(key)) continue;
      if (!isStartOrEnd && occupiedCells.has(key)) continue;

      const gScore = current.g + 1;
      let neighborNode = openSet.find(
        (n) => n.x === neighbor.x && n.z === neighbor.z
      );

      if (!neighborNode) {
        neighborNode = {
          x: neighbor.x,
          z: neighbor.z,
          f: 0,
          g: gScore,
          h: manhattanDistance(neighbor, end),
          parent: current,
        };
        openSet.push(neighborNode);
      } else if (gScore < neighborNode.g) {
        neighborNode.g = gScore;
        neighborNode.parent = current;
      }

      neighborNode.f = neighborNode.g + neighborNode.h;
    }
  }

  // 경로를 못 찾은 경우: L자 경로로 폴백
  return createLShapedPath(start, end);
}

/**
 * 클러스터의 경계 엣지(perimeter edges) 추출
 * 이웃 셀이 존재하지 않는 방향의 엣지만 추출
 */
function extractPerimeterEdges(cells: GridCell[]): RoadSegment[] {
  const cellSet = new Set(cells.map((c) => `${c.x},${c.z}`));
  const edges: RoadSegment[] = [];
  const cellSize = GRID_CONFIG.CELL_SIZE;

  // 4방향 오프셋: 상, 하, 좌, 우
  const directions = [
    { dx: 0, dz: -1, edge: "top" },
    { dx: 0, dz: 1, edge: "bottom" },
    { dx: -1, dz: 0, edge: "left" },
    { dx: 1, dz: 0, edge: "right" },
  ];

  for (const cell of cells) {
    const worldX = cell.x * cellSize;
    const worldZ = cell.z * cellSize;

    for (const dir of directions) {
      const neighborKey = `${cell.x + dir.dx},${cell.z + dir.dz}`;

      // 이웃 셀이 클러스터에 없으면 해당 방향 엣지가 경계선
      if (!cellSet.has(neighborKey)) {
        let segment: RoadSegment;

        switch (dir.edge) {
          case "top":
            segment = {
              x1: worldX,
              z1: worldZ,
              x2: worldX + cellSize,
              z2: worldZ,
              type: "perimeter",
            };
            break;
          case "bottom":
            segment = {
              x1: worldX,
              z1: worldZ + cellSize,
              x2: worldX + cellSize,
              z2: worldZ + cellSize,
              type: "perimeter",
            };
            break;
          case "left":
            segment = {
              x1: worldX,
              z1: worldZ,
              x2: worldX,
              z2: worldZ + cellSize,
              type: "perimeter",
            };
            break;
          case "right":
            segment = {
              x1: worldX + cellSize,
              z1: worldZ,
              x2: worldX + cellSize,
              z2: worldZ + cellSize,
              type: "perimeter",
            };
            break;
          default:
            continue;
        }

        edges.push(segment);
      }
    }
  }

  return edges;
}

/**
 * 두 점 사이의 L자 경로(그리드 기반) 생성
 * 수평 이동 -> 수직 이동 순서
 */
function createLShapedPath(from: GridCell, to: GridCell): RoadSegment[] {
  const segments: RoadSegment[] = [];

  const fromWorld = gridCellToWorld(from);
  const toWorld = gridCellToWorld(to);

  // 수평 이동 (X축)
  if (from.x !== to.x) {
    segments.push({
      x1: fromWorld.x,
      z1: fromWorld.z,
      x2: toWorld.x,
      z2: fromWorld.z,
      type: "mst",
    });
  }

  // 수직 이동 (Z축)
  if (from.z !== to.z) {
    segments.push({
      x1: toWorld.x,
      z1: fromWorld.z,
      x2: toWorld.x,
      z2: toWorld.z,
      type: "mst",
    });
  }

  return segments;
}

/**
 * MST 생성 로직 (A* 알고리즘 사용)
 * Centroid 대신 클러스터 간 '최단 거리 경계 셀'을 찾아서 연결
 */
function buildMST(
  clusters: RoadCluster[],
  occupiedCells: Set<string>
): RoadSegment[] {
  if (clusters.length <= 1) return [];

  const mstEdges: RoadSegment[] = [];
  const visited = new Set<string>();

  // 첫 번째 클러스터 포함
  visited.add(clusters[0].id);

  while (visited.size < clusters.length) {
    let minGlobalDist = Infinity;
    let bestConnection: {
      fromCell: GridCell;
      toCell: GridCell;
      toClusterId: string;
    } | null = null;

    // Visited 그룹과 Unvisited 그룹 사이의 최단 거리 탐색
    for (const visitedCluster of clusters.filter((c) => visited.has(c.id))) {
      for (const targetCluster of clusters.filter((c) => !visited.has(c.id))) {
        // Centroid 거리로 1차 필터링 (성능 최적화)
        if (
          manhattanDistance(visitedCluster.centroid, targetCluster.centroid) >
          minGlobalDist + 20
        ) {
          continue;
        }

        // 두 클러스터의 모든 셀 조합 중 가장 가까운 쌍 찾기
        let minLocalDist = Infinity;
        let localBestPair: { from: GridCell; to: GridCell } | null = null;

        for (const c1 of visitedCluster.cells) {
          for (const c2 of targetCluster.cells) {
            const dist = manhattanDistance(c1, c2);
            if (dist < minLocalDist) {
              minLocalDist = dist;
              localBestPair = { from: c1, to: c2 };
            }
          }
        }

        if (minLocalDist < minGlobalDist && localBestPair) {
          minGlobalDist = minLocalDist;
          bestConnection = {
            fromCell: localBestPair.from,
            toCell: localBestPair.to,
            toClusterId: targetCluster.id,
          };
        }
      }
    }

    if (bestConnection) {
      // A* 알고리즘으로 실제 경로 생성
      const pathSegments = findPathAStar(
        bestConnection.fromCell,
        bestConnection.toCell,
        occupiedCells
      );

      mstEdges.push(...pathSegments);
      visited.add(bestConnection.toClusterId);
    } else {
      // 연결할 수 없는 고립된 섬이 발생한 경우
      const unvisited = clusters.find((c) => !visited.has(c.id));
      if (unvisited) visited.add(unvisited.id);
      else break;
    }
  }

  return mstEdges;
}

/**
 * 도로 네트워크 생성 알고리즘 (개선된 버전)
 *
 * 건물 배치를 분석하여 도로 네트워크를 생성합니다.
 *
 * 규칙:
 * 1. Manhattan Distance 기반으로 인접 건물 클러스터링
 * 2. 클러스터 크기 제한 (가로 MAX_WIDTH, 세로 MAX_HEIGHT)
 * 3. 각 클러스터의 경계선(perimeter)만 도로로 생성
 * 4. 클러스터 간 MST(최소 신장 트리) 연결
 *
 * @param buildings 건물 목록
 * @returns 도로 네트워크 (클러스터 정보 + MST 엣지 + 전체 도로 선분)
 */
export function calculateRoadNetwork(
  buildings: PlacedObject[]
): RoadNetwork {
  if (buildings.length === 0) {
    return { clusters: [], mstEdges: [], allRoadSegments: [] };
  }

  // 1. 건물 위치를 그리드 셀로 변환 (중복 제거)
  const buildingCells: Map<string, GridCell> = new Map();
  // 충돌 감지용 Set 생성
  const occupiedSet = new Set<string>();

  buildings.forEach((building) => {
    const cell = positionToGridCell(building.position);
    const key = `${cell.x},${cell.z}`;
    buildingCells.set(key, cell);
    occupiedSet.add(key);
  });

  const cells = Array.from(buildingCells.values());

  // 2. Union-Find로 거리 기반 클러스터링 (크기 제한 적용)
  const uf = new UnionFind();
  const clusterCellsMap: Map<string, GridCell[]> = new Map();

  // 각 셀을 자신의 클러스터로 초기화
  cells.forEach((cell) => {
    const root = uf.find(cell);
    clusterCellsMap.set(root, [cell]);
  });

  // 거리 기반으로 인접한 셀들을 병합 (크기 제한 확인)
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      const cell1 = cells[i];
      const cell2 = cells[j];

      // 거리 기반 근접 규칙 적용 (areAdjacent 대체)
      if (!areNearby(cell1, cell2)) continue;
      if (uf.connected(cell1, cell2)) continue;

      // 병합 후 크기 확인
      const root1 = uf.find(cell1);
      const root2 = uf.find(cell2);
      const cluster1 = clusterCellsMap.get(root1) || [cell1];
      const cluster2 = clusterCellsMap.get(root2) || [cell2];
      const merged = [...cluster1, ...cluster2];

      // 크기 제한 확인
      if (!exceedsClusterSize(merged)) {
        // 병합 진행
        uf.union(cell1, cell2);
        const newRoot = uf.find(cell1);
        clusterCellsMap.set(newRoot, merged);
        if (newRoot !== root1) clusterCellsMap.delete(root1);
        if (newRoot !== root2) clusterCellsMap.delete(root2);
      }
    }
  }

  // 3. 최종 클러스터 구성
  const rootToCells: Map<string, GridCell[]> = new Map();
  cells.forEach((cell) => {
    const root = uf.find(cell);
    if (!rootToCells.has(root)) {
      rootToCells.set(root, []);
    }
    rootToCells.get(root)!.push(cell);
  });

  // 4. 클러스터 정보 생성 (경계선 포함)
  const clusters: RoadCluster[] = [];
  let clusterId = 0;

  rootToCells.forEach((clusterCells) => {
    const centroid = calculateCentroid(clusterCells);
    const perimeterEdges = extractPerimeterEdges(clusterCells);

    clusters.push({
      id: `cluster_${clusterId++}`,
      cells: clusterCells,
      centroid,
      perimeterEdges,
    });
  });

  // 5. MST(최소 신장 트리) 생성 (A* 알고리즘으로 건물 피해서 연결)
  const mstEdges = buildMST(clusters, occupiedSet);

  // 6. 전체 도로 선분 합치기
  const allRoadSegments: RoadSegment[] = [
    ...clusters.flatMap((c) => c.perimeterEdges),
    ...mstEdges,
  ];

  return {
    clusters,
    mstEdges,
    allRoadSegments,
  };
}

/**
 * 도로 선분을 셰이더 Uniform 형식으로 변환
 * vec4 배열로 변환: (x1, z1, x2, z2)
 */
export function roadSegmentsToShaderFormat(
  segments: RoadSegment[],
  maxSegments: number = 100
): Float32Array {
  const data = new Float32Array(maxSegments * 4);

  segments.slice(0, maxSegments).forEach((segment, i) => {
    const offset = i * 4;
    data[offset] = segment.x1;
    data[offset + 1] = segment.z1;
    data[offset + 2] = segment.x2;
    data[offset + 3] = segment.z2;
  });

  return data;
}

/**
 * 레거시 호환용: 기존 calculateRoadClusters 함수
 * @deprecated calculateRoadNetwork를 사용하세요
 */
export function calculateRoadClusters(
  buildings: PlacedObject[]
): RoadClusterBounds[] {
  const network = calculateRoadNetwork(buildings);
  const cellSize = GRID_CONFIG.CELL_SIZE;

  return network.clusters.map((cluster) => {
    const minX = Math.min(...cluster.cells.map((c) => c.x));
    const maxX = Math.max(...cluster.cells.map((c) => c.x));
    const minZ = Math.min(...cluster.cells.map((c) => c.z));
    const maxZ = Math.max(...cluster.cells.map((c) => c.z));

    return {
      id: cluster.id,
      minX: minX * cellSize - cellSize * 0.1,
      minZ: minZ * cellSize - cellSize * 0.1,
      maxX: (maxX + 1) * cellSize + cellSize * 0.1,
      maxZ: (maxZ + 1) * cellSize + cellSize * 0.1,
      buildingCount: cluster.cells.length,
    };
  });
}

/**
 * 레거시 호환용: 바운딩 박스를 셰이더 형식으로 변환
 * @deprecated roadSegmentsToShaderFormat을 사용하세요
 */
export function clustersToShaderFormat(
  clusters: RoadClusterBounds[],
  maxClusters: number = 20
): Float32Array {
  const data = new Float32Array(maxClusters * 4);

  clusters.slice(0, maxClusters).forEach((cluster, i) => {
    const offset = i * 4;
    data[offset] = cluster.minX;
    data[offset + 1] = cluster.minZ;
    data[offset + 2] = cluster.maxX;
    data[offset + 3] = cluster.maxZ;
  });

  return data;
}
