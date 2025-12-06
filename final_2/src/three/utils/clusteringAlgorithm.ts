import { GRID_CONFIG } from "../config/grid";
import type { GridCell, PlacedObject } from "../config/types";

// --- 타입 정의 ---
export interface RoadSegment {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  type: "small" | "big" | "bridge";
  width: number;
}

export interface RoadCluster {
  id: string;
  buildings: GridCell[];
  centroid: GridCell;
  hub: GridCell | null;
  isCore: boolean;
}

export interface RoadNetwork {
  clusters: RoadCluster[];
  smallRoads: RoadSegment[];
  bigRoads: RoadSegment[];
  allRoadSegments: RoadSegment[];
}

// --- Configuration ---
const ALGORITHM_CONFIG = {
  // DBSCAN Parameters
  EPSILON: 2, // 이웃 범위 (맨해튼 거리)
  MIN_POINTS: 2, // 코어 건물 판정 기준

  // Cost Function Weights
  ALPHA_TURN: 5.0, // 직선 선호도 (방향 전환 페널티)
  BETA_PROXIMITY: 3.0, // 건물 회피도
  GAMMA_DENSITY: 2.0, // 밀집 지역 회피도

  // Density Field
  DENSITY_KERNEL_SIZE: 5, // Gaussian 커널 크기
  DENSITY_SIGMA: 1.5, // Gaussian 표준편차

  // Road Widths
  SMALL_ROAD_WIDTH: 0.5,
  BIG_ROAD_WIDTH: 1.0,
  BRIDGE_ROAD_WIDTH: 0.8,

  // Pathfinding
  MAX_PATH_ITERATIONS: 2000,
  MAX_CLUSTER_DISTANCE: 100,
};

// --- Helper Functions ---

function positionToGridCell(position: [number, number, number]): GridCell {
  const cellSize = GRID_CONFIG.CELL_SIZE;
  return {
    x: Math.floor(position[0] / cellSize),
    z: Math.floor(position[2] / cellSize),
  };
}

function gridIndexToWorldEdge(x: number, z: number): { x: number; z: number } {
  const cellSize = GRID_CONFIG.CELL_SIZE;
  return {
    x: x * cellSize,
    z: z * cellSize,
  };
}

function manhattanDistance(cell1: GridCell, cell2: GridCell): number {
  return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.z - cell2.z);
}

function getSegmentKey(s: RoadSegment): string {
  const x1 = Math.min(s.x1, s.x2);
  const x2 = Math.max(s.x1, s.x2);
  const z1 = Math.min(s.z1, s.z2);
  const z2 = Math.max(s.z1, s.z2);
  return `${x1.toFixed(2)},${z1.toFixed(2)}-${x2.toFixed(2)},${z2.toFixed(2)}`;
}

function cellKey(x: number, z: number): string {
  return `${x},${z}`;
}

// --- Spatial Hash Grid for O(1) neighbor lookup ---
class SpatialHashGrid {
  private cells: Map<string, GridCell[]> = new Map();
  private allCells: GridCell[] = [];

  add(cell: GridCell): void {
    const key = cellKey(cell.x, cell.z);
    if (!this.cells.has(key)) {
      this.cells.set(key, []);
    }
    this.cells.get(key)!.push(cell);
    this.allCells.push(cell);
  }

  has(x: number, z: number): boolean {
    return this.cells.has(cellKey(x, z));
  }

  getNeighbors(cell: GridCell, radius: number): GridCell[] {
    const neighbors: GridCell[] = [];
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        if (dx === 0 && dz === 0) continue;
        const key = cellKey(cell.x + dx, cell.z + dz);
        if (this.cells.has(key)) {
          neighbors.push(...this.cells.get(key)!);
        }
      }
    }
    return neighbors;
  }

  getAll(): GridCell[] {
    return this.allCells;
  }
}

// --- Density Field Computation ---
class DensityField {
  private densityMap: Map<string, number> = new Map();
  private maxDensity: number = 0;

  constructor(occupiedCells: SpatialHashGrid) {
    this.computeDensityField(occupiedCells);
  }

  private gaussianWeight(distance: number): number {
    const sigma = ALGORITHM_CONFIG.DENSITY_SIGMA;
    return Math.exp(-(distance * distance) / (2 * sigma * sigma));
  }

  private computeDensityField(occupiedCells: SpatialHashGrid): void {
    const allCells = occupiedCells.getAll();
    const kernelSize = ALGORITHM_CONFIG.DENSITY_KERNEL_SIZE;
    const halfKernel = Math.floor(kernelSize / 2);

    // 밀도 필드 경계 계산
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    for (const cell of allCells) {
      minX = Math.min(minX, cell.x);
      maxX = Math.max(maxX, cell.x);
      minZ = Math.min(minZ, cell.z);
      maxZ = Math.max(maxZ, cell.z);
    }

    // 패딩 추가
    minX -= halfKernel + 2;
    maxX += halfKernel + 2;
    minZ -= halfKernel + 2;
    maxZ += halfKernel + 2;

    // 모든 셀에 대해 밀도 계산
    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        let density = 0;
        for (let dx = -halfKernel; dx <= halfKernel; dx++) {
          for (let dz = -halfKernel; dz <= halfKernel; dz++) {
            if (occupiedCells.has(x + dx, z + dz)) {
              const dist = Math.abs(dx) + Math.abs(dz);
              density += this.gaussianWeight(dist);
            }
          }
        }
        if (density > 0) {
          this.densityMap.set(cellKey(x, z), density);
          this.maxDensity = Math.max(this.maxDensity, density);
        }
      }
    }
  }

  getDensity(x: number, z: number): number {
    return this.densityMap.get(cellKey(x, z)) || 0;
  }

  getNormalizedDensity(x: number, z: number): number {
    if (this.maxDensity === 0) return 0;
    return this.getDensity(x, z) / this.maxDensity;
  }
}

// --- Union-Find (Disjoint Set) ---
class UnionFind<T extends string | number> {
  private parent: Map<T, T> = new Map();
  private rank: Map<T, number> = new Map();

  constructor(elements: T[]) {
    elements.forEach((e) => {
      this.parent.set(e, e);
      this.rank.set(e, 0);
    });
  }

  find(i: T): T {
    if (this.parent.get(i) === i) return i;
    const root = this.find(this.parent.get(i)!);
    this.parent.set(i, root); // Path compression
    return root;
  }

  union(i: T, j: T): void {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI === rootJ) return;

    // Union by rank
    const rankI = this.rank.get(rootI)!;
    const rankJ = this.rank.get(rootJ)!;
    if (rankI < rankJ) {
      this.parent.set(rootI, rootJ);
    } else if (rankI > rankJ) {
      this.parent.set(rootJ, rootI);
    } else {
      this.parent.set(rootJ, rootI);
      this.rank.set(rootI, rankI + 1);
    }
  }

  connected(i: T, j: T): boolean {
    return this.find(i) === this.find(j);
  }
}

// --- Direction Enum for Turn Penalty ---
enum Direction {
  NONE = 0,
  NORTH = 1, // -z
  SOUTH = 2, // +z
  EAST = 3, // +x
  WEST = 4, // -x
}

function getDirection(dx: number, dz: number): Direction {
  if (dx === 1) return Direction.EAST;
  if (dx === -1) return Direction.WEST;
  if (dz === 1) return Direction.SOUTH;
  if (dz === -1) return Direction.NORTH;
  return Direction.NONE;
}

function getTurnPenalty(prevDir: Direction, currDir: Direction): number {
  if (prevDir === Direction.NONE) return 0;
  if (prevDir === currDir) return 0; // 직진

  // 반대 방향 (U-turn)
  if (
    (prevDir === Direction.NORTH && currDir === Direction.SOUTH) ||
    (prevDir === Direction.SOUTH && currDir === Direction.NORTH) ||
    (prevDir === Direction.EAST && currDir === Direction.WEST) ||
    (prevDir === Direction.WEST && currDir === Direction.EAST)
  ) {
    return 3.0; // U-turn은 높은 페널티
  }

  return 1.0; // 90도 회전
}

// --- A* Pathfinding with Improved Cost Function ---

interface PathNode {
  x: number;
  z: number;
  f: number;
  g: number;
  h: number;
  parent: PathNode | null;
  direction: Direction;
}

function computeProximityPenalty(
  x: number,
  z: number,
  occupiedGrid: SpatialHashGrid
): number {
  let penalty = 0;
  const dirs = [
    { dx: 1, dz: 0 },
    { dx: -1, dz: 0 },
    { dx: 0, dz: 1 },
    { dx: 0, dz: -1 },
  ];
  for (const d of dirs) {
    if (occupiedGrid.has(x + d.dx, z + d.dz)) {
      penalty += 1;
    }
  }
  return penalty;
}

function findPathAStar(
  start: GridCell,
  end: GridCell,
  occupiedGrid: SpatialHashGrid,
  densityField: DensityField,
  isBigRoad: boolean
): RoadSegment[] {
  if (start.x === end.x && start.z === end.z) return [];

  const openSet: PathNode[] = [];
  const closedSet = new Map<string, number>();

  const { ALPHA_TURN, BETA_PROXIMITY, GAMMA_DENSITY } = ALGORITHM_CONFIG;

  openSet.push({
    x: start.x,
    z: start.z,
    f: 0,
    g: 0,
    h: manhattanDistance(start, end),
    parent: null,
    direction: Direction.NONE,
  });

  let iterations = 0;
  const maxIterations = ALGORITHM_CONFIG.MAX_PATH_ITERATIONS;

  while (openSet.length > 0 && iterations++ < maxIterations) {
    // 가장 낮은 f 값을 가진 노드 선택
    let winner = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) winner = i;
    }
    const current = openSet.splice(winner, 1)[0];

    // 목표 도달
    if (current.x === end.x && current.z === end.z) {
      const path: RoadSegment[] = [];
      let temp: PathNode | null = current;
      while (temp && temp.parent) {
        const p1 = gridIndexToWorldEdge(temp.parent.x, temp.parent.z);
        const p2 = gridIndexToWorldEdge(temp.x, temp.z);
        path.push({
          x1: p1.x,
          z1: p1.z,
          x2: p2.x,
          z2: p2.z,
          type: isBigRoad ? "big" : "small",
          width: isBigRoad
            ? ALGORITHM_CONFIG.BIG_ROAD_WIDTH
            : ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
        });
        temp = temp.parent;
      }
      return path;
    }

    const key = cellKey(current.x, current.z);
    closedSet.set(key, current.g);

    // 이웃 탐색 (4방향)
    const neighbors = [
      { dx: 1, dz: 0 },
      { dx: -1, dz: 0 },
      { dx: 0, dz: 1 },
      { dx: 0, dz: -1 },
    ];

    for (const { dx, dz } of neighbors) {
      const nx = current.x + dx;
      const nz = current.z + dz;
      const nKey = cellKey(nx, nz);

      const isDestination = nx === end.x && nz === end.z;

      // 건물 위는 통과 불가 (목적지 제외)
      if (!isDestination && occupiedGrid.has(nx, nz)) continue;

      const newDir = getDirection(dx, dz);

      // === 다중 가중치 Cost Function ===
      // C_base: 기본 이동 비용
      const baseCost = 1.0;

      // C_turn: 방향 전환 페널티
      const turnPenalty =
        ALPHA_TURN * getTurnPenalty(current.direction, newDir);

      // C_proximity: 건물 인접 페널티
      const proximityPenalty = isBigRoad
        ? BETA_PROXIMITY * computeProximityPenalty(nx, nz, occupiedGrid)
        : 0;

      // C_density: 밀집 지역 회피 (Big Road만)
      const densityPenalty = isBigRoad
        ? GAMMA_DENSITY * densityField.getNormalizedDensity(nx, nz) * 5
        : 0;

      const gScore =
        current.g + baseCost + turnPenalty + proximityPenalty + densityPenalty;

      // 이미 더 좋은 경로로 방문했다면 스킵
      if (closedSet.has(nKey) && closedSet.get(nKey)! <= gScore) continue;

      // Heuristic with Line-of-Sight bonus
      let hScore = manhattanDistance({ x: nx, z: nz }, end);

      // 목표와 같은 축에 있으면 보너스
      if (nx === end.x || nz === end.z) {
        hScore -= 0.5;
      }

      const fScore = gScore + hScore;

      const existingNode = openSet.find((n) => n.x === nx && n.z === nz);
      if (!existingNode) {
        openSet.push({
          x: nx,
          z: nz,
          f: fScore,
          g: gScore,
          h: hScore,
          parent: current,
          direction: newDir,
        });
      } else if (gScore < existingNode.g) {
        existingNode.g = gScore;
        existingNode.f = fScore;
        existingNode.parent = current;
        existingNode.direction = newDir;
      }
    }
  }

  // 경로를 찾지 못함
  return [];
}

// --- DBSCAN-inspired Clustering ---

interface BuildingNode {
  index: number;
  cell: GridCell;
  isCore: boolean;
  clusterId: number;
  accessPoint: GridCell | null;
}

function getAccessPoint(
  cell: GridCell,
  occupiedGrid: SpatialHashGrid
): GridCell | null {
  const directions = [
    { dx: 0, dz: 1 },
    { dx: 1, dz: 0 },
    { dx: 0, dz: -1 },
    { dx: -1, dz: 0 },
  ];
  for (const dir of directions) {
    const neighbor = { x: cell.x + dir.dx, z: cell.z + dir.dz };
    if (!occupiedGrid.has(neighbor.x, neighbor.z)) {
      return neighbor;
    }
  }
  return null;
}

function performDBSCANClustering(
  buildings: GridCell[],
  occupiedGrid: SpatialHashGrid
): BuildingNode[] {
  const { EPSILON, MIN_POINTS } = ALGORITHM_CONFIG;

  const nodes: BuildingNode[] = buildings.map((cell, index) => ({
    index,
    cell,
    isCore: false,
    clusterId: -1, // -1 = unvisited
    accessPoint: getAccessPoint(cell, occupiedGrid),
  }));

  // Step 1: Identify Core buildings
  for (const node of nodes) {
    const neighbors = occupiedGrid.getNeighbors(node.cell, EPSILON);
    if (neighbors.length >= MIN_POINTS) {
      node.isCore = true;
    }
  }

  // Step 2: Expand clusters from core buildings
  let currentClusterId = 0;

  for (const node of nodes) {
    if (node.clusterId !== -1) continue; // Already visited
    if (!node.isCore) continue; // Start from core only

    // BFS to expand cluster
    const queue: BuildingNode[] = [node];
    node.clusterId = currentClusterId;

    while (queue.length > 0) {
      const current = queue.shift()!;

      // Find neighbors within epsilon
      const neighborCells = occupiedGrid.getNeighbors(current.cell, EPSILON);

      for (const neighborCell of neighborCells) {
        const neighborNode = nodes.find(
          (n) => n.cell.x === neighborCell.x && n.cell.z === neighborCell.z
        );
        if (!neighborNode) continue;

        if (neighborNode.clusterId === -1) {
          neighborNode.clusterId = currentClusterId;

          // If neighbor is also core, add to queue for expansion
          if (neighborNode.isCore) {
            queue.push(neighborNode);
          }
        }
      }
    }

    currentClusterId++;
  }

  // Step 3: Assign border buildings to nearest cluster
  for (const node of nodes) {
    if (node.clusterId !== -1) continue;

    // Find nearest assigned building
    let nearestDist = Infinity;
    let nearestCluster = 0;

    for (const other of nodes) {
      if (other.clusterId === -1) continue;
      const dist = manhattanDistance(node.cell, other.cell);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestCluster = other.clusterId;
      }
    }

    node.clusterId = nearestCluster;
  }

  return nodes;
}

// --- Edge-Centric Small Road Generation ---

function generateSharedEdges(
  buildings: GridCell[],
  occupiedGrid: SpatialHashGrid
): RoadSegment[] {
  const edgeSet = new Map<string, RoadSegment>();
  const cellSize = GRID_CONFIG.CELL_SIZE;

  for (const cell of buildings) {
    const cx = cell.x * cellSize;
    const cz = cell.z * cellSize;

    // 수평 엣지 검사 (위쪽 경계)
    // 만약 (x, z-1)에 건물이 있다면, 공유 엣지 생성
    if (occupiedGrid.has(cell.x, cell.z - 1)) {
      const edge: RoadSegment = {
        x1: cx,
        z1: cz,
        x2: cx + cellSize,
        z2: cz,
        type: "small",
        width: ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
      };
      edgeSet.set(getSegmentKey(edge), edge);
    }

    // 수직 엣지 검사 (왼쪽 경계)
    // 만약 (x-1, z)에 건물이 있다면, 공유 엣지 생성
    if (occupiedGrid.has(cell.x - 1, cell.z)) {
      const edge: RoadSegment = {
        x1: cx,
        z1: cz,
        x2: cx,
        z2: cz + cellSize,
        type: "small",
        width: ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
      };
      edgeSet.set(getSegmentKey(edge), edge);
    }
  }

  return Array.from(edgeSet.values());
}

// --- Cluster Hub Selection ---

function selectClusterHub(clusterNodes: BuildingNode[]): GridCell | null {
  if (clusterNodes.length === 0) return null;

  // 1. Centroid 계산
  let sumX = 0,
    sumZ = 0;
  let validCount = 0;

  for (const node of clusterNodes) {
    if (node.accessPoint) {
      sumX += node.accessPoint.x;
      sumZ += node.accessPoint.z;
      validCount++;
    }
  }

  if (validCount === 0) return null;

  const centroid: GridCell = {
    x: Math.round(sumX / validCount),
    z: Math.round(sumZ / validCount),
  };

  // 2. Centroid와 가장 가까운 Access Point 선택
  let bestHub: GridCell | null = null;
  let minDist = Infinity;

  for (const node of clusterNodes) {
    if (!node.accessPoint) continue;
    const dist = manhattanDistance(node.accessPoint, centroid);
    if (dist < minDist) {
      minDist = dist;
      bestHub = node.accessPoint;
    }
  }

  return bestHub;
}

// --- Main Algorithm ---

export function calculateRoadNetwork(buildings: PlacedObject[]): RoadNetwork {
  if (buildings.length === 0) {
    return {
      clusters: [],
      smallRoads: [],
      bigRoads: [],
      allRoadSegments: [],
    };
  }

  // === Phase 1: Preprocessing ===
  const occupiedGrid = new SpatialHashGrid();
  const buildingCells: GridCell[] = [];

  for (const building of buildings) {
    const cell = positionToGridCell(building.position);
    occupiedGrid.add(cell);
    buildingCells.push(cell);
  }

  // Density Field 계산
  const densityField = new DensityField(occupiedGrid);

  // === Phase 2: DBSCAN Clustering ===
  const clusterNodes = performDBSCANClustering(buildingCells, occupiedGrid);

  // 클러스터별 그룹화
  const clusterGroups = new Map<number, BuildingNode[]>();
  for (const node of clusterNodes) {
    if (!clusterGroups.has(node.clusterId)) {
      clusterGroups.set(node.clusterId, []);
    }
    clusterGroups.get(node.clusterId)!.push(node);
  }

  // === Phase 3: Small Roads (Intra-Cluster) ===
  // === Phase 3: Small Roads (Intra-Cluster) ===
  const allSegments = new Map<string, RoadSegment>();

  // 3.1 공유 엣지 (골목길) 생성
  const sharedEdges = generateSharedEdges(buildingCells, occupiedGrid);
  for (const edge of sharedEdges) {
    allSegments.set(getSegmentKey(edge), edge);
  }

  // [중요] 여기서 connectivityUf를 초기화해야 합니다!
  // 건물 인덱스(0, 1, 2...)를 ID로 사용하는 Union-Find 생성
  const buildingIds = buildingCells.map((_, i) => i);
  const connectivityUf = new UnionFind(buildingIds);

  // [중요] 이미 붙어있는 건물들(공유 엣지)을 Union-Find에 미리 반영
  // 이걸 안 하면 이미 붙어있는 건물끼리 또 도로를 놓으려고 시도하게 됩니다.
  for (let i = 0; i < buildingCells.length; i++) {
    const cell = buildingCells[i];
    const adjacentDirs = [
      { dx: 1, dz: 0 },
      { dx: -1, dz: 0 },
      { dx: 0, dz: 1 },
      { dx: 0, dz: -1 },
    ];

    for (const dir of adjacentDirs) {
      // 인접한 칸에 다른 건물이 있는지 확인
      const neighborIdx = buildingCells.findIndex(
        (c) => c.x === cell.x + dir.dx && c.z === cell.z + dir.dz
      );
      if (neighborIdx !== -1) {
        // 물리적으로 붙어있으면 논리적으로도 연결 처리
        connectivityUf.union(i, neighborIdx);
      }
    }
  }

  // 3.2 클러스터 내 고립 건물 연결 (MST + 진입로 추가)
  clusterGroups.forEach((groupNodes) => {
    if (groupNodes.length < 2) return;

    // Kruskal's Algorithm
    const edges: { u: number; v: number; dist: number }[] = [];

    for (let i = 0; i < groupNodes.length; i++) {
      for (let j = i + 1; j < groupNodes.length; j++) {
        const nodeI = groupNodes[i];
        const nodeJ = groupNodes[j];

        // 이미 연결된 상태면 엣지 추가 안 함
        if (connectivityUf.connected(nodeI.index, nodeJ.index)) continue;
        if (!nodeI.accessPoint || !nodeJ.accessPoint) continue;

        const dist = manhattanDistance(nodeI.accessPoint, nodeJ.accessPoint);
        edges.push({ u: i, v: j, dist });
      }
    }

    edges.sort((a, b) => a.dist - b.dist);

    for (const edge of edges) {
      const nodeU = groupNodes[edge.u];
      const nodeV = groupNodes[edge.v];

      if (connectivityUf.connected(nodeU.index, nodeV.index)) continue;
      if (!nodeU.accessPoint || !nodeV.accessPoint) continue;

      connectivityUf.union(nodeU.index, nodeV.index);

      // 1. A* 경로 생성
      const path = findPathAStar(
        nodeU.accessPoint,
        nodeV.accessPoint,
        occupiedGrid,
        densityField,
        false
      );

      for (const seg of path) {
        allSegments.set(getSegmentKey(seg), seg);
      }

      // 2. 진입로(Entrance) 세그먼트 추가 (끊김 현상 해결 로직)
      const endpoints = [nodeU, nodeV];

      for (const node of endpoints) {
        if (!node.accessPoint) continue;

        const dx = node.cell.x - node.accessPoint.x;
        const dz = node.cell.z - node.accessPoint.z;

        const p1 = gridIndexToWorldEdge(node.accessPoint.x, node.accessPoint.z);
        const cellSize = GRID_CONFIG.CELL_SIZE;

        let connector: RoadSegment | null = null;

        // 건물이 동쪽
        if (dx === 1 && dz === 0) {
          connector = {
            x1: p1.x,
            z1: p1.z,
            x2: p1.x + cellSize,
            z2: p1.z,
            type: "small",
            width: ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
          };
        }
        // 건물이 서쪽
        else if (dx === -1 && dz === 0) {
          connector = {
            x1: p1.x,
            z1: p1.z,
            x2: p1.x - cellSize,
            z2: p1.z,
            type: "small",
            width: ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
          };
        }
        // 건물이 남쪽
        else if (dx === 0 && dz === 1) {
          connector = {
            x1: p1.x,
            z1: p1.z,
            x2: p1.x,
            z2: p1.z + cellSize,
            type: "small",
            width: ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
          };
        }
        // 건물이 북쪽
        else if (dx === 0 && dz === -1) {
          connector = {
            x1: p1.x,
            z1: p1.z,
            x2: p1.x,
            z2: p1.z - cellSize,
            type: "small",
            width: ALGORITHM_CONFIG.SMALL_ROAD_WIDTH,
          };
        }

        if (connector) {
          allSegments.set(getSegmentKey(connector), connector);
        }
      }
    }
  });

  // === Phase 4: Cluster Hubs ===
  const clusterData: RoadCluster[] = [];
  const clusterHubs: { clusterId: number; hub: GridCell }[] = [];

  clusterGroups.forEach((groupNodes, clusterId) => {
    const hub = selectClusterHub(groupNodes);

    const cluster: RoadCluster = {
      id: `cluster_${clusterId}`,
      buildings: groupNodes.map((n) => n.cell),
      centroid: hub || groupNodes[0].cell,
      hub,
      isCore: groupNodes.some((n) => n.isCore),
    };

    clusterData.push(cluster);

    if (hub) {
      clusterHubs.push({ clusterId, hub });
    }
  });

  // === Phase 5: Big Roads (Inter-Cluster MST) ===
  const bigRoadSegments: RoadSegment[] = [];

  if (clusterHubs.length > 1) {
    // 허브 간 거리 기반 엣지 생성
    const hubEdges: { u: number; v: number; dist: number }[] = [];

    for (let i = 0; i < clusterHubs.length; i++) {
      for (let j = i + 1; j < clusterHubs.length; j++) {
        const dist = manhattanDistance(clusterHubs[i].hub, clusterHubs[j].hub);

        if (dist <= ALGORITHM_CONFIG.MAX_CLUSTER_DISTANCE) {
          hubEdges.push({ u: i, v: j, dist });
        }
      }
    }

    hubEdges.sort((a, b) => a.dist - b.dist);

    const hubUf = new UnionFind(clusterHubs.map((_, i) => i));

    for (const edge of hubEdges) {
      if (hubUf.connected(edge.u, edge.v)) continue;

      hubUf.union(edge.u, edge.v);

      const path = findPathAStar(
        clusterHubs[edge.u].hub,
        clusterHubs[edge.v].hub,
        occupiedGrid,
        densityField,
        true
      );

      for (const seg of path) {
        seg.type = "big";
        seg.width = ALGORITHM_CONFIG.BIG_ROAD_WIDTH;

        const key = getSegmentKey(seg);
        if (!allSegments.has(key)) {
          bigRoadSegments.push(seg);
          allSegments.set(key, seg);
        }
      }
    }
  }

  // === Phase 6: Connectivity Guarantee ===
  // 모든 세그먼트가 연결되어 있는지 확인

  const smallRoads = Array.from(allSegments.values()).filter(
    (s) => s.type === "small"
  );

  const allRoadSegments = Array.from(allSegments.values());

  return {
    clusters: clusterData,
    smallRoads,
    bigRoads: bigRoadSegments,
    allRoadSegments,
  };
}

// --- Road Smoothing (Post-Processing) ---

export function smoothRoadNetwork(segments: RoadSegment[]): RoadSegment[] {
  if (segments.length < 2) return segments;

  const smoothed: RoadSegment[] = [];
  const processed = new Set<string>();

  // 연속된 직선 세그먼트 병합
  for (const seg of segments) {
    const key = getSegmentKey(seg);
    if (processed.has(key)) continue;

    // 같은 방향의 연속 세그먼트 찾기
    const merged = { ...seg };
    let foundMerge = true;

    while (foundMerge) {
      foundMerge = false;
      for (const other of segments) {
        const otherKey = getSegmentKey(other);
        if (processed.has(otherKey)) continue;

        // 수평 세그먼트 병합
        if (
          merged.z1 === merged.z2 &&
          other.z1 === other.z2 &&
          merged.z1 === other.z1 &&
          merged.type === other.type
        ) {
          if (merged.x2 === other.x1) {
            merged.x2 = other.x2;
            processed.add(otherKey);
            foundMerge = true;
          } else if (merged.x1 === other.x2) {
            merged.x1 = other.x1;
            processed.add(otherKey);
            foundMerge = true;
          }
        }

        // 수직 세그먼트 병합
        if (
          merged.x1 === merged.x2 &&
          other.x1 === other.x2 &&
          merged.x1 === other.x1 &&
          merged.type === other.type
        ) {
          if (merged.z2 === other.z1) {
            merged.z2 = other.z2;
            processed.add(otherKey);
            foundMerge = true;
          } else if (merged.z1 === other.z2) {
            merged.z1 = other.z1;
            processed.add(otherKey);
            foundMerge = true;
          }
        }
      }
    }

    processed.add(key);
    smoothed.push(merged);
  }

  return smoothed;
}

// --- Shader Format Conversion ---

export function roadSegmentsToShaderFormat(
  segments: RoadSegment[],
  maxSegments: number = 500
): { positions: Float32Array; widths: Float32Array; count: number } {
  const positions = new Float32Array(maxSegments * 4);
  const widths = new Float32Array(maxSegments);

  const count = Math.min(segments.length, maxSegments);

  segments.slice(0, count).forEach((segment, i) => {
    const offset = i * 4;
    positions[offset] = segment.x1;
    positions[offset + 1] = segment.z1;
    positions[offset + 2] = segment.x2;
    positions[offset + 3] = segment.z2;
    widths[i] = segment.width;
  });

  return { positions, widths, count };
}

// --- Debug/Visualization Helpers ---

export function getRoadNetworkStats(network: RoadNetwork): {
  totalClusters: number;
  totalSmallRoads: number;
  totalBigRoads: number;
  avgClusterSize: number;
} {
  const totalClusters = network.clusters.length;
  const totalSmallRoads = network.smallRoads.length;
  const totalBigRoads = network.bigRoads.length;
  const avgClusterSize =
    totalClusters > 0
      ? network.clusters.reduce((sum, c) => sum + c.buildings.length, 0) /
        totalClusters
      : 0;

  return {
    totalClusters,
    totalSmallRoads,
    totalBigRoads,
    avgClusterSize,
  };
}
