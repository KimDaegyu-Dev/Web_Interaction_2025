import type { BuildingStructureBox } from "@/utils/supabase";

/**
 * 건물 타입 정의
 */
export interface BuildingType {
  key: string;
  name: string;
  meshIndex: number;
  description: string;
}

/**
 * 그리드 셀 좌표
 */
export interface GridCell {
  x: number;
  z: number;
}

/**
 * 배치된 오브젝트 인스턴스
 */
export interface PlacedObject {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  buildingText?: string | null;
  title?: string | null;
  author?: string | null;
}

/**
 * 화환 인스턴스
 */
export interface WreathInstance {
  id: string;
  buildingId: string;
  message?: string | null;
  sender?: string | null;
  position: [number, number, number];
  hasDropped: boolean;
}

/**
 * 커서 데이터 (실시간)
 */
export interface CursorPosition {
  userId: string;
  gridX: number;
  gridZ: number;
  color: string;
}
