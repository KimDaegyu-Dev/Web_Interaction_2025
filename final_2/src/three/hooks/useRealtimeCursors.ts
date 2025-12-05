import { useCallback, useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import { throttleTime, Subject } from "rxjs";
import type { CursorPosition } from "../config/types";
import { generateId } from "@/utils";

/**
 * 실시간 커서 공유 훅
 * RxJS throttle + Supabase Broadcast
 */
export function useRealtimeCursors() {
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [myCursor, setMyCursor] = useState<{ gridX: number; gridZ: number } | null>(null);
  const userId = useRef<string>(generateId());
  const cursorSubject = useRef<Subject<{ gridX: number; gridZ: number }>>(new Subject());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // 채널 설정
  useEffect(() => {
    const channel = supabase.channel("cursors", {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const { user_id, grid_x, grid_z, color } = payload;
        
        setCursors((prev) => {
          const existing = prev.findIndex((c) => c.userId === user_id);
          const newCursor: CursorPosition = {
            userId: user_id,
            gridX: grid_x,
            gridZ: grid_z,
            color: color || "#ff6b6b",
          };

          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newCursor;
            return updated;
          }

          return [...prev, newCursor];
        });
      })
      .on("broadcast", { event: "cursor_leave" }, ({ payload }) => {
        setCursors((prev) => prev.filter((c) => c.userId !== payload.user_id));
      })
      .subscribe();

    channelRef.current = channel;

    // RxJS throttle 설정 (200ms)
    const subscription = cursorSubject.current
      .pipe(throttleTime(200))
      .subscribe(({ gridX, gridZ }) => {
        channel.send({
          type: "broadcast",
          event: "cursor",
          payload: {
            user_id: userId.current,
            grid_x: gridX,
            grid_z: gridZ,
            color: "#ff6b6b",
          },
        });
      });

    return () => {
      channel.send({
        type: "broadcast",
        event: "cursor_leave",
        payload: { user_id: userId.current },
      });
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  // 커서 위치 업데이트
  const updateCursor = useCallback((gridX: number, gridZ: number) => {
    setMyCursor({ gridX, gridZ });
    cursorSubject.current.next({ gridX, gridZ });
  }, []);

  // 커서 숨기기
  const hideCursor = useCallback(() => {
    setMyCursor(null);
    channelRef.current?.send({
      type: "broadcast",
      event: "cursor_leave",
      payload: { user_id: userId.current },
    });
  }, []);

  return {
    cursors,
    myCursor,
    updateCursor,
    hideCursor,
  };
}
