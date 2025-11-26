import { useState, useCallback, useEffect } from "react";
import { supabase, type BuildingData, type InsertBuildingData } from "@/utils/supabase";

export interface Building {
  id: string;
  position: [number, number, number];
  color: number;
  mesh_index: number;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
  modelKey?: string | null;
}

export function useBuildingPersistence() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load buildings from Supabase
  useEffect(() => {
    const loadBuildings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("cubes")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading buildings:", error);
          return;
        }

        if (data) {
          const loadedBuildings: Building[] = data.map((building: BuildingData) => ({
            id: building.id,
            position: [building.position_x, building.position_y, building.position_z],
            color: building.color,
            mesh_index: building.mesh_index,
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

  // Realtime subscription
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
            const newBuilding: BuildingData = payload.new as BuildingData;
            console.log("INSERT event - New building:", newBuilding);
            setBuildings((prev) => {
              if (prev.some((building) => building.id === newBuilding.id)) {
                console.log("Building already exists, skipping:", newBuilding.id);
                return prev;
              }
              return [
                ...prev,
                {
                  id: newBuilding.id,
                  position: [
                    newBuilding.position_x,
                    newBuilding.position_y,
                    newBuilding.position_z,
                  ],
                  color: newBuilding.color,
                  mesh_index: newBuilding.mesh_index,
                  title: newBuilding.title,
                  author: newBuilding.author,
                  message1: newBuilding.message1,
                  message2: newBuilding.message2,
                },
              ];
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedBuilding: BuildingData = payload.new as BuildingData;
            console.log("UPDATE event - Updated building:", updatedBuilding);
            setBuildings((prev) =>
              prev.map((building) =>
                building.id === updatedBuilding.id
                  ? {
                      ...building,
                      title: updatedBuilding.title,
                      author: updatedBuilding.author,
                      message1: updatedBuilding.message1,
                      message2: updatedBuilding.message2,
                    }
                  : building,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            const deletedBuilding: BuildingData = payload.old as BuildingData;
            console.log("DELETE event - Deleted building:", deletedBuilding);
            setBuildings((prev) =>
              prev.filter((building) => building.id !== deletedBuilding.id),
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

  // Create building
  const createBuilding = useCallback(
    async (
      data: Omit<InsertBuildingData, "password">,
      password: string,
    ): Promise<BuildingData> => {
      const insertData: InsertBuildingData = {
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
          console.error("Error creating building:", error);
          throw error;
        }

        // Realtime will handle adding to state
        if (result) {
          const newBuilding: Building = {
            id: result.id,
            position: [result.position_x, result.position_y, result.position_z],
            color: result.color,
            mesh_index: result.mesh_index,
            title: result.title,
            author: result.author,
            message1: result.message1,
            message2: result.message2,
          };
          setBuildings((prev) => {
            if (prev.some((building) => building.id === newBuilding.id)) {
              return prev;
            }
            return [...prev, newBuilding];
          });
        }

        return result;
      } catch (error) {
        console.error("Error creating building:", error);
        throw error;
      }
    },
    [],
  );

  // Delete building
  const deleteBuilding = useCallback(async (buildingId: string, password: string) => {
    try {
      const { data: buildingData, error: fetchError } = await supabase
        .from("cubes")
        .select("password")
        .eq("id", buildingId)
        .single();

      if (fetchError || !buildingData) {
        throw new Error("건물을 찾을 수 없습니다.");
      }

      if (buildingData.password !== password) {
        throw new Error("패스워드가 일치하지 않습니다.");
      }

      const { error } = await supabase.from("cubes").delete().eq("id", buildingId);

      if (error) {
        console.error("Error deleting building:", error);
        throw error;
      }

      // Realtime will handle removing from state
      setBuildings((prev) => prev.filter((building) => building.id !== buildingId));
    } catch (error) {
      console.error("Error deleting building:", error);
      throw error;
    }
  }, []);

  // Update building
  const updateBuilding = useCallback(
    async (
      buildingId: string,
      updates: {
        title?: string | null;
        author?: string | null;
        message1?: string | null;
        message2?: string | null;
      },
      password: string,
    ) => {
      try {
        const { data: buildingData, error: fetchError } = await supabase
          .from("cubes")
          .select("password")
          .eq("id", buildingId)
          .single();

        if (fetchError || !buildingData) {
          throw new Error("건물을 찾을 수 없습니다.");
        }

        if (buildingData.password !== password) {
          throw new Error("패스워드가 일치하지 않습니다.");
        }

        const { data, error } = await supabase
          .from("cubes")
          .update(updates)
          .eq("id", buildingId)
          .select()
          .single();

        if (error) {
          console.error("Error updating building:", error);
          throw error;
        }

        // Realtime will handle updating state
        if (data) {
          setBuildings((prev) =>
            prev.map((building) =>
              building.id === buildingId
                ? {
                    ...building,
                    title: data.title,
                    author: data.author,
                    message1: data.message1,
                    message2: data.message2,
                  }
                : building,
            ),
          );
        }

        return data;
      } catch (error) {
        console.error("Error updating building:", error);
        throw error;
      }
    },
    [],
  );

  return {
    buildings,
    isLoading,
    createBuilding,
    deleteBuilding,
    updateBuilding,
  };
}
