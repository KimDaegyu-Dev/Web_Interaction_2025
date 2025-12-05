import type { BuildingStructureBox } from "@/utils/supabase";

/**
 * 건물 프리셋 정의
 * mesh_index를 키로 사용하여 건물 구조를 정의합니다.
 * 
 * 각 Box는 position(상대 위치)과 scale(크기)을 가집니다.
 * position: [x, y, z] - 건물 중심 기준 상대 좌표
 * scale: [width, height, depth] - 박스 크기
 */

export interface BuildingPreset {
  meshIndex: number;
  name: string;
  description: string;
  structure: BuildingStructureBox[];
}

/**
 * 12개의 건물 프리셋 (mesh_index 0-11)
 * 다양한 형태: 단순 박스, ㄱ자, ㄷ자, 높낮이 조합
 */
export const BUILDING_PRESETS: BuildingPreset[] = [
  // 0: 단순 높은 타워
  {
    meshIndex: 0,
    name: "스카이 타워",
    description: "높은 단일 타워 건물",
    structure: [
      { position: [0, 2, 0], scale: [2, 4, 2] },
    ],
  },
  
  // 1: 낮은 넓은 건물
  {
    meshIndex: 1,
    name: "로우 플랫",
    description: "낮고 넓은 평면 건물",
    structure: [
      { position: [0, 0.75, 0], scale: [3, 1.5, 3] },
    ],
  },
  
  // 2: ㄱ자 건물
  {
    meshIndex: 2,
    name: "코너 빌딩",
    description: "ㄱ자 형태의 코너 건물",
    structure: [
      { position: [0, 1.5, 0], scale: [3, 3, 1] },
      { position: [1, 1.5, 1], scale: [1, 3, 3] },
    ],
  },
  
  // 3: ㄷ자 건물
  {
    meshIndex: 3,
    name: "U자 빌딩",
    description: "ㄷ자 형태의 열린 건물",
    structure: [
      { position: [-1, 1, 0], scale: [1, 2, 3] },
      { position: [1, 1, 0], scale: [1, 2, 3] },
      { position: [0, 1, -1], scale: [3, 2, 1] },
    ],
  },
  
  // 4: 계단식 건물
  {
    meshIndex: 4,
    name: "스텝 타워",
    description: "계단식으로 올라가는 건물",
    structure: [
      { position: [0, 0.5, 0], scale: [3, 1, 3] },
      { position: [0, 1.5, 0], scale: [2, 1, 2] },
      { position: [0, 2.5, 0], scale: [1, 1, 1] },
    ],
  },
  
  // 5: 쌍둥이 타워
  {
    meshIndex: 5,
    name: "트윈 타워",
    description: "두 개의 타워가 나란히 있는 건물",
    structure: [
      { position: [-0.75, 2, 0], scale: [1, 4, 2] },
      { position: [0.75, 2, 0], scale: [1, 4, 2] },
    ],
  },
  
  // 6: T자 건물
  {
    meshIndex: 6,
    name: "T자 빌딩",
    description: "T자 형태의 건물",
    structure: [
      { position: [0, 1, 0], scale: [4, 2, 1] },
      { position: [0, 1, 1], scale: [1.5, 2, 2] },
    ],
  },
  
  // 7: 십자 건물
  {
    meshIndex: 7,
    name: "크로스 빌딩",
    description: "십자 형태의 건물",
    structure: [
      { position: [0, 1.5, 0], scale: [4, 3, 1] },
      { position: [0, 1.5, 0], scale: [1, 3, 4] },
    ],
  },
  
  // 8: 높낮이 조합
  {
    meshIndex: 8,
    name: "믹스 타워",
    description: "높이가 다른 박스들의 조합",
    structure: [
      { position: [-1, 1, 0], scale: [1.5, 2, 2] },
      { position: [0.75, 2, 0], scale: [1.5, 4, 2] },
    ],
  },
  
  // 9: L자 높은 건물
  {
    meshIndex: 9,
    name: "엘 타워",
    description: "L자 형태의 높은 건물",
    structure: [
      { position: [-0.5, 2.5, 0], scale: [2, 5, 2] },
      { position: [1, 1, 0], scale: [2, 2, 2] },
    ],
  },
  
  // 10: 중앙 타워 + 날개
  {
    meshIndex: 10,
    name: "윙 타워",
    description: "중앙 타워와 양쪽 날개",
    structure: [
      { position: [0, 2, 0], scale: [1.5, 4, 1.5] },
      { position: [-1.5, 0.5, 0], scale: [1.5, 1, 2] },
      { position: [1.5, 0.5, 0], scale: [1.5, 1, 2] },
    ],
  },
  
  // 11: 복합 단지
  {
    meshIndex: 11,
    name: "복합 단지",
    description: "여러 건물이 모인 복합 단지",
    structure: [
      { position: [-1, 1.5, -1], scale: [1.2, 3, 1.2] },
      { position: [1, 1, -1], scale: [1.2, 2, 1.2] },
      { position: [-1, 0.75, 1], scale: [1.2, 1.5, 1.2] },
      { position: [1, 2, 1], scale: [1.2, 4, 1.2] },
    ],
  },
];

/**
 * mesh_index로 건물 프리셋 가져오기
 */
export function getBuildingPreset(meshIndex: number): BuildingPreset {
  const preset = BUILDING_PRESETS.find((p) => p.meshIndex === meshIndex);
  if (!preset) {
    // 기본값: 단순 박스
    return BUILDING_PRESETS[0];
  }
  return preset;
}

/**
 * mesh_index로 건물 구조 가져오기
 */
export function getBuildingStructure(meshIndex: number): BuildingStructureBox[] {
  return getBuildingPreset(meshIndex).structure;
}

/**
 * 사용 가능한 모든 프리셋 목록
 */
export function getAllBuildingPresets(): BuildingPreset[] {
  return BUILDING_PRESETS;
}
