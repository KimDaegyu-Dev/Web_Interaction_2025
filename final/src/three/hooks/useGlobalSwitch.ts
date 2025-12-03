import { useGlobalSwitchStore } from "@/stores/globalSwitchStore";

export function useGlobalSwitch() {
  const { isLightMode, toggleSwitch } = useGlobalSwitchStore();

  return {
    isLightMode,
    toggleSwitch,
    isLoading: false,
  };
}
