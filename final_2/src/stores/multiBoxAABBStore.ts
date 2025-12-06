import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MultiBoxAABBState {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
}

/**
 * 다중 박스 AABB 모드 토글 스토어
 */
export const useMultiBoxAABBStore = create(
  persist<MultiBoxAABBState>(
    (set) => ({
      enabled: false,
      toggle: () => set((state) => ({ enabled: !state.enabled })),
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: "multi-box-aabb",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
