import { useEffect, useState, useCallback, useRef } from "react";
import { supabase, type CursorData } from "@/utils/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";

// Generate a unique user ID for this session
const generateUserId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
};

// Generate a random color for the cursor
const generateCursorColor = () => {
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Cyan
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface CursorUpdate {
  gridX: number;
  gridZ: number;
}

export function useRealtimeCursors() {
  const [cursors, setCursors] = useState<Map<string, CursorData>>(new Map());
  const [myCursorPosition, setMyCursorPosition] = useState<{ gridX: number; gridZ: number } | null>(null);
  const [myUserId] = useState(() => generateUserId());
  const [myColor] = useState(() => generateCursorColor());
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // RxJS Subject for cursor updates
  const cursorUpdateSubject = useRef<Subject<CursorUpdate>>(new Subject());

  // Setup RxJS throttling
  useEffect(() => {
    const subscription = cursorUpdateSubject.current
      .pipe(
        throttleTime(500, undefined, { leading: true, trailing: true }) // 500ms throttle (2 updates/sec)
      )
      .subscribe(async ({ gridX, gridZ }) => {
        try {
          const { error } = await supabase.from("cursors").upsert(
            {
              user_id: myUserId,
              grid_x: gridX,
              grid_z: gridZ,
              color: myColor,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
            }
          );

          if (error) {
            console.error("Error updating cursor:", error);
          }
        } catch (err) {
          console.error("Failed to update cursor:", err);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [myUserId, myColor]);

  // Update my cursor position
  const updateMyCursor = useCallback(
    (gridX: number, gridZ: number) => {
      // Update local state immediately for responsive UI
      setMyCursorPosition({ gridX, gridZ });

      // Emit to RxJS subject for throttled network update
      cursorUpdateSubject.current.next({ gridX, gridZ });
    },
    []
  );

  // Subscribe to cursor updates
  useEffect(() => {
    // Initial fetch of existing cursors
    const fetchCursors = async () => {
      const { data, error } = await supabase
        .from("cursors")
        .select("*")
        .neq("user_id", myUserId);

      if (error) {
        console.error("Error fetching cursors:", error);
        return;
      }

      if (data) {
        const cursorMap = new Map<string, CursorData>();
        data.forEach((cursor) => {
          cursorMap.set(cursor.user_id, cursor as CursorData);
        });
        setCursors(cursorMap);
      }
    };

    fetchCursors();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("cursors-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cursors",
        },
        (payload) => {
          const cursor = payload.new as CursorData;

          // Ignore my own cursor
          if (cursor.user_id === myUserId) return;

          setCursors((prev) => {
            const next = new Map(prev);
            
            if (payload.eventType === "DELETE") {
              next.delete(cursor.user_id);
            } else {
              next.set(cursor.user_id, cursor);
            }
            
            return next;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup: remove my cursor when leaving
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Delete my cursor from the database
      supabase
        .from("cursors")
        .delete()
        .eq("user_id", myUserId)
        .then(() => {
          console.log("Cursor removed on cleanup");
        });
    };
  }, [myUserId]);

  // Cleanup stale cursors (older than 10 seconds)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();
      
      supabase
        .from("cursors")
        .delete()
        .lt("updated_at", tenSecondsAgo)
        .then(({ error }) => {
          if (error) {
            console.error("Error cleaning up stale cursors:", error);
          }
        });
    }, 5000); // Run cleanup every 5 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    cursors: Array.from(cursors.values()),
    myCursorPosition,
    updateMyCursor,
    myUserId,
    myColor,
  };
}
