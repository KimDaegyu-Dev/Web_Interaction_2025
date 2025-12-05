import { GRID_CONFIG } from "../config/grid";
import type { GridCell, PlacedObject } from "../config/types";

/**
 * 도로 선분
 */
export interface RoadSegment {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  type: "perimeter" | "mst";
}

export interface RoadCluster {
  id: string;
  cells: GridCell[];
  centroid: GridCell;
  perimeterEdges: RoadSegment[]; // 호환성을 위해 타입은 유지하되, 실제로는 Spine 경로가 들어감
}

export interface RoadNetwork {
  clusters: RoadCluster[];
  mstEdges: RoadSegment[];
  allRoadSegments: RoadSegment[];
}

/**
 * Union-Find (Disjoint Set)
 */
class UnionFind {
  private parent: Map<string, string> = new Map();

  private getKey(cell: GridCell): string {
    return `${cell.x},${cell.z}`;
  }

  find(cell: GridCell): string {
    const key = this.getKey(cell);
    if (!this.parent.has(key)) {
      this.parent.set(key, key);
    }

    let root = key;
    while (this.parent.get(root) !== root) {
      root = this.parent.get(root)!;
    }

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
    if (root1 !== root2) {
      this.parent.set(root1, root2);
    }
  }

  connected(cell1: GridCell, cell2: GridCell): boolean {
    return this.find(cell1) === this.find(cell2);
  }
}

function positionToGridCell(position: [number, number, number]): GridCell {
  const cellSize = GRID_CONFIG.CELL_SIZE;
  return {
    x: Math.floor(position[0] / cellSize),
    z: Math.floor(position[2] / cellSize),
  };
}

function gridCellToWorld(cell: GridCell): { x: number; z: number } {
  const cellSize = GRID_CONFIG.CELL_SIZE;
  // 1x1 그리드에 맞게 라인은 엣지(Edge)를 따라가야 하므로, 
  // 그리드 중심(Center)보다는 교차점(Corner)이나 중심을 기준으로 연결하되
  // 여기서는 A*가 셀 단위로 움직이므로 셀 중심으로 계산하고 렌더링 시 보정
  return {
    x: cell.x * cellSize + cellSize / 2,
    z: cell.z * cellSize + cellSize / 2,
  };
}

function manhattanDistance(cell1: GridCell, cell2: GridCell): number {
  return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.z - cell2.z);
}

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
 * A* 길찾기용 노드
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
 * 건물의 "진입점(Access Point)" 찾기
 * 건물 주변 4방향 중 건물이 없는 빈 셀을 반환
 * 우선순위: 아래(Bottom) -> 오른쪽(Right) -> 위(Top) -> 왼쪽(Left)
 */
function getAccessPoint(cell: GridCell, occupiedSet: Set<string>): GridCell | null {
  const directions = [
    { dx: 0, dz: 1 },  // Bottom
    { dx: 1, dz: 0 },  // Right
    { dx: 0, dz: -1 }, // Top
    { dx: -1, dz: 0 }, // Left
  ];

  for (const dir of directions) {
    const neighbor = { x: cell.x + dir.dx, z: cell.z + dir.dz };
    if (!occupiedSet.has(`${neighbor.x},${neighbor.z}`)) {
      return neighbor;
    }
  }
  return null; // 사방이 막힘 (거의 발생 안함)
}

/**
 * A* 길찾기 (건물 회피)
 */
function findPathAStar(
  start: GridCell,
  end: GridCell,
  occupiedCells: Set<string>
): RoadSegment[] {
  // 시작점이나 끝점이 건물이면 경로 생성 불가 (안전장치)
  // 하지만 AccessPoint를 사용하므로 이 경우는 드묾
  if (start.x === end.x && start.z === end.z) return [];

  const openSet: PathNode[] = [];
  const closedSet = new Set<string>();
  const cellSize = GRID_CONFIG.CELL_SIZE;

  openSet.push({
    x: start.x,
    z: start.z,
    f: 0,
    g: 0,
    h: manhattanDistance(start, end),
    parent: null,
  });

  // 너무 긴 경로 방지
  let maxIter = 300; 

  while (openSet.length > 0 && maxIter-- > 0) {
    let winner = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) winner = i;
    }
    const current = openSet[winner];

    if (current.x === end.x && current.z === end.z) {
      const path: RoadSegment[] = [];
      let temp: PathNode | null = current;
      while (temp && temp.parent) {
        // 셀 중심 좌표
        const x1 = temp.parent.x * cellSize + cellSize / 2;
        const z1 = temp.parent.z * cellSize + cellSize / 2;
        const x2 = temp.x * cellSize + cellSize / 2;
        const z2 = temp.z * cellSize + cellSize / 2;
        path.push({ x1, z1, x2, z2, type: "mst" });
        temp = temp.parent;
      }
      return path; // 역순이지만 선분이라 상관없음
    }

    openSet.splice(winner, 1);
    closedSet.add(`${current.x},${current.z}`);

    const neighbors = [
      { x: current.x + 1, z: current.z },
      { x: current.x - 1, z: current.z },
      { x: current.x, z: current.z + 1 },
      { x: current.x, z: current.z - 1 },
    ];

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.z}`;
      if (closedSet.has(key)) continue;
      
      // 건물 위로는 길을 만들지 않음 (단, 목적지는 제외 - 하지만 목적지도 AccessPoint라 비어있음)
      if (occupiedCells.has(key)) continue;

      const gScore = current.g + 1;
      let neighborNode = openSet.find((n) => n.x === neighbor.x && n.z === neighbor.z);

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
        neighborNode.f = neighborNode.g + neighborNode.h;
      }
    }
  }
  return []; // 경로 없음
}

/**
 * 클러스터 내부 연결 (Spine 생성)
 * 클러스터 내의 건물들을 하나의 선(Spine)으로 연결
 */
function connectClusterInternally(
  cells: GridCell[], 
  occupiedSet: Set<string>
): RoadSegment[] {
  if (cells.length < 2) return [];

  const segments: RoadSegment[] = [];
  
  // 1. 진입점 확보
  const accessPoints = cells
    .map(cell => ({ cell, ap: getAccessPoint(cell, occupiedSet) }))
    .filter(item => item.ap !== null) as { cell: GridCell, ap: GridCell }[];

  if (accessPoints.length < 2) return [];

  // 2. 정렬 (단순 스위핑: Z축 우선, 그 다음 X축)
  // 이렇게 하면 위에서 아래로, 왼쪽에서 오른쪽으로 훑으며 연결하게 됨
  accessPoints.sort((a, b) => {
    if (a.cell.z !== b.cell.z) return a.cell.z - b.cell.z;
    return a.cell.x - b.cell.x;
  });

  // 3. 순차 연결 (Chain)
  // 모든 건물을 다 잇지 않고, 가까운 것끼리만 이어서 '골목' 형성
  for (let i = 0; i < accessPoints.length - 1; i++) {
    const start = accessPoints[i].ap;
    const end = accessPoints[i+1].ap;
    
    // 너무 멀면 연결 안 함 (같은 클러스터라도 끊어주는게 자연스러움)
    if (manhattanDistance(start, end) > 5) continue;

    const path = findPathAStar(start, end, occupiedSet);
    segments.push(...path);
  }

  return segments;
}

/**
 * 메인 도로 생성 함수
 */
export function calculateRoadNetwork(buildings: PlacedObject[]): RoadNetwork {
  if (buildings.length === 0) {
    return { clusters: [], mstEdges: [], allRoadSegments: [] };
  }

  // 1. 데이터 준비
  const buildingCells: Map<string, GridCell> = new Map();
  const occupiedSet = new Set<string>();

  buildings.forEach((building) => {
    const cell = positionToGridCell(building.position);
    const key = `${cell.x},${cell.z}`;
    if (!buildingCells.has(key)) {
      buildingCells.set(key, cell);
      occupiedSet.add(key);
    }
  });

  const cells = Array.from(buildingCells.values());
  const uf = new UnionFind();

  // 2. 클러스터링 (거리 3 이하 병합)
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      if (manhattanDistance(cells[i], cells[j]) <= 3) { // 거리 기준 완화
        uf.union(cells[i], cells[j]);
      }
    }
  }

  // 3. 클러스터 그룹핑
  const clusterGroups = new Map<string, GridCell[]>();
  cells.forEach(cell => {
    const root = uf.find(cell);
    if (!clusterGroups.has(root)) clusterGroups.set(root, []);
    clusterGroups.get(root)!.push(cell);
  });

  const clusters: RoadCluster[] = [];
  const clusterAccessPoints: { clusterId: string, ap: GridCell }[] = [];

  let idCounter = 0;

  // 4. 각 클러스터 처리
  clusterGroups.forEach((groupCells) => {
    const id = `cluster_${idCounter++}`;
    const centroid = calculateCentroid(groupCells);

    // [중요 변경] Perimeter(테두리) 대신 Internal Spine(내부 골목길) 생성
    // 건물이 1개면 segments가 빈 배열이 되어 길에 둘러싸이지 않음!
    const internalRoads = connectClusterInternally(groupCells, occupiedSet);

    // 클러스터 대표 진입점 선정 (MST 연결용)
    // 센트로이드와 가장 가까운 건물의 진입점을 사용
    let bestAp: GridCell | null = null;
    let minDist = Infinity;
    
    for (const cell of groupCells) {
      const ap = getAccessPoint(cell, occupiedSet);
      if (ap) {
        const dist = manhattanDistance(ap, centroid);
        if (dist < minDist) {
          minDist = dist;
          bestAp = ap;
        }
      }
    }

    if (bestAp) {
      clusterAccessPoints.push({ clusterId: id, ap: bestAp });
    }

    clusters.push({
      id,
      cells: groupCells,
      centroid,
      perimeterEdges: internalRoads, // 이름은 perimeter지만 내용은 Spine
    });
  });

  // 5. MST 생성 (클러스터 간 연결)
  const mstEdges: RoadSegment[] = [];
  if (clusterAccessPoints.length > 1) {
    const visited = new Set<string>();
    visited.add(clusterAccessPoints[0].clusterId);

    // Prim's Algorithm variation
    while (visited.size < clusterAccessPoints.length) {
      let minGlobalDist = Infinity;
      let bestPath: RoadSegment[] = [];
      let targetClusterId = "";

      // 이미 방문한 클러스터 집합에서 -> 방문하지 않은 클러스터로 가는 최단 경로 탐색
      for (const visitedId of visited) {
        const startNode = clusterAccessPoints.find(c => c.clusterId === visitedId)!;
        
        for (const unvisitedNode of clusterAccessPoints) {
          if (visited.has(unvisitedNode.clusterId)) continue;

          // 거리 가볍게 체크 (Manhattan)
          const dist = manhattanDistance(startNode.ap, unvisitedNode.ap);
          if (dist < minGlobalDist) {
            // A*로 실제 경로 확인 (건물 회피)
            const path = findPathAStar(startNode.ap, unvisitedNode.ap, occupiedSet);
            if (path.length > 0) {
              // 경로 길이(세그먼트 수)가 실제 거리
              if (path.length < minGlobalDist) {
                minGlobalDist = path.length;
                bestPath = path;
                targetClusterId = unvisitedNode.clusterId;
              }
            }
          }
        }
      }

      if (targetClusterId && bestPath.length > 0) {
        mstEdges.push(...bestPath);
        visited.add(targetClusterId);
      } else {
        // 연결 불가능한 섬이 있으면 건너뜀 (무한루프 방지)
        const left = clusterAccessPoints.find(c => !visited.has(c.clusterId));
        if (left) visited.add(left.clusterId);
        else break;
      }
    }
  }

  // 6. 모든 도로 합치기
  const allRoadSegments = [
    ...clusters.flatMap(c => c.perimeterEdges),
    ...mstEdges
  ];

  return { clusters, mstEdges, allRoadSegments };
}

// Shader 포맷 변환 유틸리티 (변경 없음)
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