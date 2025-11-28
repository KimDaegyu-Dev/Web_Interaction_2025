import { useEffect, useState, useCallback } from "react";
import { supabase, type GlobalSwitchData } from "@/utils/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

const SWITCH_ID = "global-light-switch"; // Single global switch

export function useGlobalSwitch() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle the global switch
  const toggleSwitch = useCallback(async () => {
    try {
      const newMode = !isLightMode;
      
      const { error } = await supabase
        .from("global_switch")
        .upsert(
          {
            id: SWITCH_ID,
            is_light_mode: newMode,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

      if (error) {
        console.error("Error toggling switch:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Failed to toggle switch:", err);
      return false;
    }
  }, [isLightMode]);

  // Subscribe to switch state changes
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const initSwitch = async () => {
      // Fetch current state
      const { data, error } = await supabase
        .from("global_switch")
        .select("*")
        .eq("id", SWITCH_ID)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = not found
        console.error("Error fetching switch state:", error);
      }

      if (data) {
        setIsLightMode((data as GlobalSwitchData).is_light_mode);
      } else {
        // Initialize the switch if it doesn't exist
        const { error: insertError } = await supabase
          .from("global_switch")
          .insert({
            id: SWITCH_ID,
            is_light_mode: false,
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Error initializing switch:", insertError);
        }
      }

      setIsLoading(false);

      // Subscribe to real-time updates
      channel = supabase
        .channel("global-switch-channel")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "global_switch",
            filter: `id=eq.${SWITCH_ID}`,
          },
          (payload) => {
            const switchData = payload.new as GlobalSwitchData;
            setIsLightMode(switchData.is_light_mode);
          }
        )
        .subscribe();
    };

    initSwitch();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return {
    isLightMode,
    toggleSwitch,
    isLoading,
  };
}
