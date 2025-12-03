import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/utils/supabase";
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
    // "#FFA07A", // Light Salmon - Removed to avoid blending with LightMode
    "#98D8C8", // Mint
    // "#F7DC6F", // Yellow - Removed to avoid blending with LightMode
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
    "#2E9AFE", // Dodger Blue (Added for more contrast)
    "#FF00FF", // Magenta (Added for more contrast)
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

interface CursorUpdate {
  gridX: number;
  gridZ: number;
}

// Broadcast message payload
interface BroadcastCursorPayload {
  user_id: string;
  grid_x: number;
  grid_z: number;
  color: string;
  timestamp: number;
}

// In-memory cursor data (no DB)
export interface CursorData {
  user_id: string;
  grid_x: number;
  grid_z: number;
  color: string;
  timestamp: number;
}

export function useRealtimeCursors() {
  const [cursors, setCursors] = useState<Map<string, CursorData>>(new Map());
  const [myCursorPosition, setMyCursorPosition] = useState<{ gridX: number; gridZ: number } | null>(null);
  const [myUserId] = useState(() => generateUserId());
  const [myColor] = useState(() => generateCursorColor());
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // RxJS Subject for cursor updates
  const cursorUpdateSubject = useRef<Subject<CursorUpdate>>(new Subject()  );

  // Subscribe to broadcast cursor updates FIRST (before RxJS setup)
  useEffect(() => {
    // Create broadcast channel
    const channel = supabase
      .channel("cursors-broadcast", {
        config: {
          broadcast: { self: false }, // Don't receive our own broadcasts
        },
      })
      .on(
        "broadcast",
        { event: "cursor-move" },
        (payload: { payload: BroadcastCursorPayload }) => {
          const cursor = payload.payload;

          // Ignore my own cursor (extra safety)
          if (cursor.user_id === myUserId) return;

          console.log("Received cursor:", cursor); // Debug log

          setCursors((prev) => {
            const next = new Map(prev);
            next.set(cursor.user_id, {
              user_id: cursor.user_id,
              grid_x: cursor.grid_x,
              grid_z: cursor.grid_z,
              color: cursor.color,
              timestamp: cursor.timestamp,
            });
            return next;
          });
        }
      )
      .on(
        "broadcast",
        { event: "cursor-leave" },
        (payload: { payload: { user_id: string } }) => {
          setCursors((prev) => {
            const next = new Map(prev);
            next.delete(payload.payload.user_id);
            return next;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup: broadcast leave event when unmounting
    return () => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "cursor-leave",
          payload: { user_id: myUserId },
        });
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [myUserId]);

  // Setup RxJS throttling and broadcast (runs AFTER channel is set up)
  useEffect(() => {
    const subscription = cursorUpdateSubject.current
      .pipe(
        throttleTime(100, undefined, { leading: true, trailing: true }) // 100ms throttle (10 updates/sec)
      )
      .subscribe(({ gridX, gridZ }) => {
        // Broadcast cursor position instead of DB upsert
        if (channelRef.current) {
          console.log("Broadcasting cursor:", gridX, gridZ); // Debug log
          channelRef.current.send({
            type: "broadcast",
            event: "cursor-move",
            payload: {
              user_id: myUserId,
              grid_x: gridX,
              grid_z: gridZ,
              color: myColor,
              timestamp: Date.now(),
            } as BroadcastCursorPayload,
          });
        } else {
          console.warn("Channel not ready yet"); // Debug warning
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

      // Emit to RxJS subject for throttled broadcast
      cursorUpdateSubject.current.next({ gridX, gridZ });
    },
    []
  );

  // Cleanup stale cursors (in-memory, no DB)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const tenSecondsAgo = Date.now() - 10000;
      
      setCursors((prev) => {
        const next = new Map(prev);
        let hasChanges = false;
        
        for (const [userId, cursor] of next.entries()) {
          if (cursor.timestamp < tenSecondsAgo) {
            next.delete(userId);
            hasChanges = true;
          }
        }
        
        return hasChanges ? next : prev;
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
