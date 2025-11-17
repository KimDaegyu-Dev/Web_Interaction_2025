import { useState, useCallback, useEffect } from "react";
import { supabase, type CubeData, type InsertCubeData } from "@/utils/supabase";

export interface Cube {
  id: string;
  position: [number, number, number];
  color: number;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
}

export function useCubes() {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Supabase에서 큐브 데이터 로드
  useEffect(() => {
    const loadCubes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("cubes")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading cubes:", error);
          return;
        }

        if (data) {
          const loadedCubes: Cube[] = data.map((cube: CubeData) => ({
            id: cube.id,
            position: [cube.position_x, cube.position_y, cube.position_z],
            color: cube.color,
            title: cube.title,
            author: cube.author,
            message1: cube.message1,
            message2: cube.message2,
          }));
          setCubes(loadedCubes);
        }
      } catch (error) {
        console.error("Error loading cubes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCubes();
  }, []);

  // Realtime 구독 설정
  useEffect(() => {
    console.log("Setting up Realtime subscription for cubes table...");

    const channel = supabase
      .channel("cubes-changes", {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cubes",
        },
        (payload) => {
          console.log("Realtime event received:", payload);

          if (payload.eventType === "INSERT") {
            // 새 큐브 추가
            const newCube: CubeData = payload.new as CubeData;
            console.log("INSERT event - New cube:", newCube);
            setCubes((prev) => {
              // 이미 존재하는지 확인
              if (prev.some((cube) => cube.id === newCube.id)) {
                console.log("Cube already exists, skipping:", newCube.id);
                return prev;
              }
              return [
                ...prev,
                {
                  id: newCube.id,
                  position: [
                    newCube.position_x,
                    newCube.position_y,
                    newCube.position_z,
                  ],
                  color: newCube.color,
                  title: newCube.title,
                  author: newCube.author,
                  message1: newCube.message1,
                  message2: newCube.message2,
                },
              ];
            });
          } else if (payload.eventType === "UPDATE") {
            // 큐브 업데이트
            const updatedCube: CubeData = payload.new as CubeData;
            console.log("UPDATE event - Updated cube:", updatedCube);
            setCubes((prev) =>
              prev.map((cube) =>
                cube.id === updatedCube.id
                  ? {
                      ...cube,
                      title: updatedCube.title,
                      author: updatedCube.author,
                      message1: updatedCube.message1,
                      message2: updatedCube.message2,
                    }
                  : cube,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            // 큐브 삭제
            const deletedCube: CubeData = payload.old as CubeData;
            console.log("DELETE event - Deleted cube:", deletedCube);
            setCubes((prev) =>
              prev.filter((cube) => cube.id !== deletedCube.id),
            );
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to cubes table changes");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Realtime channel error");
        } else if (status === "TIMED_OUT") {
          console.error("❌ Realtime subscription timed out");
        } else if (status === "CLOSED") {
          console.warn("⚠️ Realtime channel closed");
        }
      });

    return () => {
      console.log("Cleaning up Realtime subscription...");
      supabase.removeChannel(channel);
    };
  }, []);

  // 큐브 생성
  const createCube = useCallback(
    async (
      data: Omit<InsertCubeData, "password">,
      password: string,
    ): Promise<CubeData> => {
      const insertData: InsertCubeData = {
        ...data,
        password,
      };

      try {
        const { data: result, error } = await supabase
          .from("cubes")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("Error creating cube:", error);
          // TODO: 패스워드 불일치 시 에러 처리
          throw error;
        }

        // Realtime으로 자동 추가되므로 여기서는 로컬 상태 업데이트 불필요
        // 하지만 즉시 반영을 위해 추가
        if (result) {
          const newCube: Cube = {
            id: result.id,
            position: [result.position_x, result.position_y, result.position_z],
            color: result.color,
            title: result.title,
            author: result.author,
            message1: result.message1,
            message2: result.message2,
          };
          setCubes((prev) => {
            // Realtime과 중복 방지
            if (prev.some((cube) => cube.id === newCube.id)) {
              return prev;
            }
            return [...prev, newCube];
          });
        }

        return result;
      } catch (error) {
        console.error("Error creating cube:", error);
        throw error;
      }
    },
    [],
  );

  // 큐브 삭제
  const deleteCube = useCallback(async (cubeId: string, password: string) => {
    // 패스워드 검증: 먼저 큐브를 가져와서 저장된 패스워드와 비교
    try {
      const { data: cubeData, error: fetchError } = await supabase
        .from("cubes")
        .select("password")
        .eq("id", cubeId)
        .single();

      if (fetchError || !cubeData) {
        throw new Error("큐브를 찾을 수 없습니다.");
      }

      // 저장된 패스워드와 입력된 패스워드 비교
      if (cubeData.password !== password) {
        throw new Error("패스워드가 일치하지 않습니다.");
      }

      // 패스워드가 일치하면 삭제
      const { error } = await supabase.from("cubes").delete().eq("id", cubeId);

      if (error) {
        console.error("Error deleting cube:", error);
        throw error;
      }

      // Realtime으로 자동 삭제되므로 여기서는 로컬 상태 업데이트 불필요
      // 하지만 즉시 반영을 위해 추가
      setCubes((prev) => prev.filter((cube) => cube.id !== cubeId));
    } catch (error) {
      console.error("Error deleting cube:", error);
      throw error;
    }
  }, []);

  // 큐브 업데이트
  const updateCube = useCallback(
    async (
      cubeId: string,
      updates: {
        title?: string | null;
        author?: string | null;
        message1?: string | null;
        message2?: string | null;
      },
      password: string,
    ) => {
      // 패스워드 검증: 먼저 큐브를 가져와서 저장된 패스워드와 비교
      try {
        const { data: cubeData, error: fetchError } = await supabase
          .from("cubes")
          .select("password")
          .eq("id", cubeId)
          .single();

        if (fetchError || !cubeData) {
          throw new Error("큐브를 찾을 수 없습니다.");
        }

        // 저장된 패스워드와 입력된 패스워드 비교
        if (cubeData.password !== password) {
          throw new Error("패스워드가 일치하지 않습니다.");
        }

        // 패스워드가 일치하면 업데이트 (패스워드는 유지)
        const { data, error } = await supabase
          .from("cubes")
          .update(updates) // 패스워드는 업데이트하지 않음
          .eq("id", cubeId)
          .select()
          .single();

        if (error) {
          console.error("Error updating cube:", error);
          throw error;
        }

        if (data) {
          // Realtime으로 자동 업데이트되므로 여기서는 로컬 상태 업데이트 불필요
          // 하지만 즉시 반영을 위해 추가
          setCubes((prev) =>
            prev.map((cube) =>
              cube.id === cubeId
                ? {
                    ...cube,
                    title: data.title,
                    author: data.author,
                    message1: data.message1,
                    message2: data.message2,
                  }
                : cube,
            ),
          );
        }

        return data;
      } catch (error) {
        console.error("Error updating cube:", error);
        throw error;
      }
    },
    [],
  );

  // 큐브 초기화
  const clearCubes = useCallback(async () => {
    try {
      const { error } = await supabase.from("cubes").delete().neq("id", "");

      if (error) {
        console.error("Error clearing cubes:", error);
        throw error;
      }

      setCubes([]);
    } catch (error) {
      console.error("Error clearing cubes:", error);
      throw error;
    }
  }, []);

  return {
    cubes,
    isLoading,
    createCube,
    deleteCube,
    updateCube,
    clearCubes,
  };
}
