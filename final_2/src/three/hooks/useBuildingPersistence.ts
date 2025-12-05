import { useState, useCallback, useEffect } from "react";
import {
  supabase,
  type BuildingData,
  type InsertBuildingData,
  type BuildingStructureBox,
} from "@/utils/supabase";
import { getBuildingStructure } from "../config/buildingPresets";
import { GRID_CONFIG } from "../config/grid";

/**
 * DB 좌표(정수형, 셀 좌하단 기준)를 렌더링 좌표(셀 중앙)로 변환
 * 예: CELL_SIZE=5일 때, 200 -> 202.5 (셀 중앙)
 */
function toRenderPosition(value: number): number {
  const halfCell = GRID_CONFIG.CELL_SIZE / 2;
  return value + halfCell;
}

export interface Building {
  id: string;
  /** 렌더링용 위치 (셀 중앙) */
  position: [number, number, number];
  /** DB 저장 위치 (정수형, 셀 좌하단) */
  dbPosition: [number, number, number];
  color: number;
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  buildingText?: string | null;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
}

/**
 * 건물 영속성 훅
 * Supabase와 실시간 동기화
 */
export function useBuildingPersistence() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 로드
  useEffect(() => {
    const loadBuildings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("buildings")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading buildings:", error);
          return;
        }

        if (data) {
          const loadedBuildings: Building[] = data.map((building: BuildingData) => ({
            id: building.id,
            position: [
              toRenderPosition(building.position_x),
              building.position_y,
              toRenderPosition(building.position_z),
            ],
            dbPosition: [
              building.position_x,
              building.position_y,
              building.position_z,
            ],
            color: building.color,
            meshIndex: building.mesh_index,
            buildingStructure: building.building_structure || getBuildingStructure(building.mesh_index),
            buildingText: building.building_text,
            title: building.title,
            author: building.author,
            message1: building.message1,
            message2: building.message2,
          }));
          setBuildings(loadedBuildings);
        }
      } catch (error) {
        console.error("Error loading buildings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBuildings();
  }, []);

  // Realtime 구독
  useEffect(() => {
    console.log("[BuildingPersistence] Setting up Realtime subscription...");

    const channel = supabase
      .channel("buildings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buildings" },
        (payload) => {
          console.log("[BuildingPersistence] Realtime event:", payload.eventType);

          if (payload.eventType === "INSERT") {
            const newBuilding = payload.new as BuildingData;
            setBuildings((prev) => {
              if (prev.some((b) => b.id === newBuilding.id)) return prev;
              return [
                ...prev,
                {
                  id: newBuilding.id,
                  position: [
                    toRenderPosition(newBuilding.position_x),
                    newBuilding.position_y,
                    toRenderPosition(newBuilding.position_z),
                  ],
                  dbPosition: [
                    newBuilding.position_x,
                    newBuilding.position_y,
                    newBuilding.position_z,
                  ],
                  color: newBuilding.color,
                  meshIndex: newBuilding.mesh_index,
                  buildingStructure: newBuilding.building_structure || getBuildingStructure(newBuilding.mesh_index),
                  buildingText: newBuilding.building_text,
                  title: newBuilding.title,
                  author: newBuilding.author,
                  message1: newBuilding.message1,
                  message2: newBuilding.message2,
                },
              ];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as BuildingData;
            setBuildings((prev) =>
              prev.map((b) =>
                b.id === updated.id
                  ? {
                      ...b,
                      buildingText: updated.building_text,
                      title: updated.title,
                      author: updated.author,
                      message1: updated.message1,
                      message2: updated.message2,
                    }
                  : b
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as BuildingData;
            setBuildings((prev) => prev.filter((b) => b.id !== deleted.id));
          }
        }
      )
      .subscribe((status) => {
        console.log("[BuildingPersistence] Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 건물 생성
  const createBuilding = useCallback(
    async (
      data: Omit<InsertBuildingData, "password" | "building_structure">,
      password: string,
      meshIndex: number
    ): Promise<BuildingData | null> => {
      try {
        const buildingStructure = getBuildingStructure(meshIndex);
        
        const insertData: InsertBuildingData = {
          ...data,
          building_structure: buildingStructure,
          password,
        };

        const { data: result, error } = await supabase
          .from("buildings")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("Error creating building:", error);
          return null;
        }

        return result;
      } catch (error) {
        console.error("Error creating building:", error);
        return null;
      }
    },
    []
  );

  // 건물 삭제
  const deleteBuilding = useCallback(
    async (id: string, password: string): Promise<boolean> => {
      try {
        // 패스워드 확인
        const { data: existing } = await supabase
          .from("buildings")
          .select("password")
          .eq("id", id)
          .single();

        if (!existing || existing.password !== password) {
          console.error("Password mismatch");
          return false;
        }

        const { error } = await supabase.from("buildings").delete().eq("id", id);

        if (error) {
          console.error("Error deleting building:", error);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error deleting building:", error);
        return false;
      }
    },
    []
  );

  // 건물 업데이트
  const updateBuilding = useCallback(
    async (
      id: string,
      updates: Partial<InsertBuildingData>,
      password: string
    ): Promise<boolean> => {
      try {
        const { data: existing } = await supabase
          .from("buildings")
          .select("password")
          .eq("id", id)
          .single();

        if (!existing || existing.password !== password) {
          console.error("Password mismatch");
          return false;
        }

        const { error } = await supabase
          .from("buildings")
          .update(updates)
          .eq("id", id);

        if (error) {
          console.error("Error updating building:", error);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error updating building:", error);
        return false;
      }
    },
    []
  );

  return {
    buildings,
    isLoading,
    createBuilding,
    deleteBuilding,
    updateBuilding,
  };
}
