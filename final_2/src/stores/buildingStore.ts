import { create } from "zustand";
import type { BuildingStructureBox } from "@/utils/supabase";

export interface Building {
  id: string;
  position: [number, number, number];
  color: number;
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  buildingText?: string | null;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
}

interface BuildingStore {
  buildings: Building[];
  selectedBuildingId: string | null;
  isLoading: boolean;
  
  // Actions
  setBuildings: (buildings: Building[]) => void;
  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  setSelectedBuildingId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useBuildingStore = create<BuildingStore>((set) => ({
  buildings: [],
  selectedBuildingId: null,
  isLoading: false,

  setBuildings: (buildings) => set({ buildings }),
  
  addBuilding: (building) =>
    set((state) => ({
      buildings: [...state.buildings, building],
    })),
  
  updateBuilding: (id, updates) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
  
  removeBuilding: (id) =>
    set((state) => ({
      buildings: state.buildings.filter((b) => b.id !== id),
      selectedBuildingId:
        state.selectedBuildingId === id ? null : state.selectedBuildingId,
    })),
  
  setSelectedBuildingId: (id) => set({ selectedBuildingId: id }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
