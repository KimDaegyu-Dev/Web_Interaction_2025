import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

interface CameraStore {
  cameraState: CameraState | null;
  setCameraState: (state: CameraState) => void;
  clearCameraState: () => void;
}
// Persisted store
export const useCameraStore = create(
  persist<CameraStore>(
    (set) => ({
      cameraState: null,
      setCameraState: (state) => set({ cameraState: state }),
      clearCameraState: () => set({ cameraState: null }),
    }),
    {
      name: "camera",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
