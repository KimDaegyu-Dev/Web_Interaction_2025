import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  },
);

// ============================================
// 건물 데이터 타입 정의
// ============================================

export interface BuildingStructureBox {
  position: [number, number, number];
  scale: [number, number, number];
}

export interface BuildingData {
  id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  color: number;
  mesh_index: number;
  building_structure?: BuildingStructureBox[] | null;
  building_text?: string | null;
  title?: string | null;
  message1?: string | null;
  message2?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface InsertBuildingData {
  position_x: number;
  position_y: number;
  position_z: number;
  color: number;
  mesh_index: number;
  building_structure?: BuildingStructureBox[] | null;
  building_text?: string | null;
  title?: string | null;
  message1?: string | null;
  message2?: string | null;
  user_id: string;
}

// ============================================
// 화환 데이터 타입 정의
// ============================================

export interface WreathData {
  id: string;
  building_id: string;
  message?: string | null;
  user_id: string;
  final_position_x?: number | null;
  final_position_y?: number | null;
  final_position_z?: number | null;
  dropped_at?: string;
  created_at?: string;
}

export interface InsertWreathData {
  building_id: string;
  message?: string | null;
  user_id: string;
  final_position_x?: number | null;
  final_position_y?: number | null;
  final_position_z?: number | null;
}

// ============================================
// 실시간 커서 데이터 타입
// ============================================

export interface CursorData {
  id: string;
  user_id: string;
  grid_x: number;
  grid_z: number;
  color: string;
  updated_at: string;
}

// ============================================
// 공용 스위치 상태 타입
// ============================================

export interface GlobalSwitchData {
  id: string;
  is_light_mode: boolean;
  updated_at: string;
}
