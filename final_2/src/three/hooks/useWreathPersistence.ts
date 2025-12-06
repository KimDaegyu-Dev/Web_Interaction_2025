import { useState, useCallback, useEffect } from "react";
import {
  supabase,
  type WreathData,
  type InsertWreathData,
} from "@/utils/supabase";
import type { WreathInstance } from "../config/types";
import { useAuthStore } from "@/stores/authStore";

/**
 * 화환 영속성 훅
 * Supabase와 실시간 동기화 + 최종 위치 저장
 */
export function useWreathPersistence(buildingId: string | null) {
  const [wreaths, setWreaths] = useState<WreathInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 특정 건물의 화환 로드
  useEffect(() => {
    if (!buildingId) {
      setWreaths([]);
      return;
    }

    const loadWreaths = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("wreaths")
          .select("*")
          .eq("building_id", buildingId)
          .order("dropped_at", { ascending: true });

        if (error) {
          console.error("Error loading wreaths:", error);
          return;
        }

        if (data) {
          const loadedWreaths: WreathInstance[] = data.map(
            (wreath: WreathData) => ({
              id: wreath.id,
              buildingId: wreath.building_id,
              message: wreath.message,
              userId: wreath.user_id,
              position: [
                wreath.final_position_x ?? 0,
                wreath.final_position_y ?? 15, // 드롭 높이에서 시작
                wreath.final_position_z ?? 0,
              ],
              hasDropped:
                wreath.final_position_y !== null && wreath.final_position_y < 1,
            })
          );
          setWreaths(loadedWreaths);
        }
      } catch (error) {
        console.error("Error loading wreaths:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWreaths();
  }, [buildingId]);

  // Realtime 구독
  useEffect(() => {
    if (!buildingId) return;

    console.log(
      "[WreathPersistence] Setting up Realtime subscription for building:",
      buildingId
    );

    const channel = supabase
      .channel(`wreaths-${buildingId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wreaths",
          filter: `building_id=eq.${buildingId}`,
        },
        (payload) => {
          console.log("[WreathPersistence] Realtime event:", payload.eventType);

          if (payload.eventType === "INSERT") {
            const newWreath = payload.new as WreathData;
            setWreaths((prev) => {
              if (prev.some((w) => w.id === newWreath.id)) return prev;
              return [
                ...prev,
                {
                  id: newWreath.id,
                  buildingId: newWreath.building_id,
                  message: newWreath.message,
                  userId: newWreath.user_id,
                  position: [
                    newWreath.final_position_x ?? 0,
                    newWreath.final_position_y ?? 15,
                    newWreath.final_position_z ?? 0,
                  ],
                  hasDropped: false,
                },
              ];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as WreathData;
            setWreaths((prev) =>
              prev.map((w) =>
                w.id === updated.id
                  ? {
                      ...w,
                      position: [
                        updated.final_position_x ?? w.position[0],
                        updated.final_position_y ?? w.position[1],
                        updated.final_position_z ?? w.position[2],
                      ],
                      hasDropped: true,
                    }
                  : w
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buildingId]);

  // 화환 생성
  const createWreath = useCallback(
    async (message: string): Promise<WreathData | null> => {
      if (!buildingId) return null;

      const user = useAuthStore.getState().user;
      const isAnonymous = useAuthStore.getState().isAnonymous();

      if (!user) {
        console.error("User not authenticated");
        return null;
      }

      if (isAnonymous) {
        console.error("Anonymous users cannot create wreaths");
        return null;
      }

      try {
        const insertData: InsertWreathData = {
          building_id: buildingId,
          message,
          user_id: user.id,
          // 초기 위치는 null (물리 시뮬레이션 후 업데이트)
          final_position_x: null,
          final_position_y: null,
          final_position_z: null,
        };

        const { data: result, error } = await supabase
          .from("wreaths")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("Error creating wreath:", error);
          return null;
        }

        return result;
      } catch (error) {
        console.error("Error creating wreath:", error);
        return null;
      }
    },
    [buildingId]
  );

  // 화환 최종 위치 업데이트 (물리 시뮬레이션 완료 후)
  const updateWreathPosition = useCallback(
    async (
      wreathId: string,
      position: [number, number, number]
    ): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from("wreaths")
          .update({
            final_position_x: position[0],
            final_position_y: position[1],
            final_position_z: position[2],
          })
          .eq("id", wreathId);

        if (error) {
          console.error("Error updating wreath position:", error);
          return false;
        }

        // 로컬 상태 업데이트
        setWreaths((prev) =>
          prev.map((w) =>
            w.id === wreathId ? { ...w, position, hasDropped: true } : w
          )
        );

        return true;
      } catch (error) {
        console.error("Error updating wreath position:", error);
        return false;
      }
    },
    []
  );

  return {
    wreaths,
    isLoading,
    createWreath,
    updateWreathPosition,
  };
}
