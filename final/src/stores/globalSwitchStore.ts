import { create } from "zustand";

interface GlobalSwitchState {
  isLightMode: boolean;
  toggleSwitch: () => void;
  setLightMode: (isLight: boolean) => void;
}

export const useGlobalSwitchStore = create<GlobalSwitchState>((set) => ({
  isLightMode: false,
  toggleSwitch: () => set((state) => ({ isLightMode: !state.isLightMode })),
  setLightMode: (isLight) => set({ isLightMode: isLight }),
}));
