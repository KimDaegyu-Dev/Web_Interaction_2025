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

// 건물 데이터 타입 정의
export interface BuildingData {
  id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  color: number;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export interface InsertBuildingData {
  position_x: number;
  position_y: number;
  position_z: number;
  color: number;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
  password: string;
}
