import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

/**
 * 다른 사용자 커서 데이터
 */
export interface OtherCursor {
  userId: string;
  gridX: number;
  gridZ: number;
  color: string;
}

interface CameraStore {
  cameraState: CameraState | null;
  setCameraState: (state: CameraState) => void;
  clearCameraState: () => void;
}

export const useCameraStore = create(
  persist<CameraStore>(
    (set) => ({
      cameraState: null,
      setCameraState: (state) => set({ cameraState: state }),
      clearCameraState: () => set({ cameraState: null }),
    }),
    {
      name: "camera-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
