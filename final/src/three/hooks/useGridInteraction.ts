import { useCallback, useEffect, useMemo, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import {
  usePlacedObjects,
  type SceneObjectInstance,
} from "./usePlacedObjects";
import type { ObjectStateKey } from "../objectSystem/modelLibrary";
import { useBuildingPersistence } from "./useBuildingPersistence";


interface GridCell {
  x: number;
  z: number;
}

export type PlacedObject = SceneObjectInstance;

type ModalMode = "create" | "edit" | "delete" | null;

interface PendingAction {
  mode: "create" | "edit" | "delete";
  position?: [number, number, number];
  buildingId?: string;
}

export interface InteractionHandlers {
  onEmptyCellClick: (x: number, z: number) => void;
  onObjectClick: (object: PlacedObject) => void;
  onGlobalSwitchClick: () => void;
}

export function useGridInteraction({
  onEmptyCellClick,
  onObjectClick,
  onGlobalSwitchClick,
}: InteractionHandlers) {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [clickedObjectId, setClickedObjectId] = useState<string | null>(null);
  
  const {
    objects,
    setObjectState,
    setAllObjectsState,
    syncFromExternal,
  } = usePlacedObjects();

  const {
    buildings: remoteBuildings,
  } = useBuildingPersistence();

  // Sync Supabase buildings into renderable glTF objects
  useEffect(() => {
    const entries = remoteBuildings.map((building) => ({
      id: building.id,
      position: building.position,
      mesh_index: building.mesh_index,
      title: building.title,
      author: building.author,
      message1: building.message1,
      message2: building.message2,
    }));
    syncFromExternal(entries);
  }, [remoteBuildings, syncFromExternal]);


  const objectsByCell = useMemo(
    () =>
      new Map(
        objects.map((obj) => [`${obj.position[0]}_${obj.position[2]}`, obj]),
      ),
    [objects],
  );

  // 그리드 셀 호버
  const onCellPointerOver = useCallback((x: number, z: number) => {
    setHoveredCell({ x, z });
  }, []);

  const onCellPointerOut = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // 그리드 클릭 핸들러 (통합됨)
  const onCellClick = useCallback(
    (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => {
      e.stopPropagation();
      
      // 1. Global Switch Check (Fixed Position: -10, 0, -10)
      if (x === -10 && z === -10) {
        onGlobalSwitchClick();
        return;
      }

      const key = `${x}_${z}`;
      const existing = objectsByCell.get(key);

      if (existing) {
        // 2. Existing Object Click
        setClickedObjectId(existing.id);
        onObjectClick(existing);
      } else {
        // 3. Empty Cell Click
        setClickedObjectId(null);
        onEmptyCellClick(x, z);
      }
    },
    [objectsByCell, onGlobalSwitchClick, onObjectClick, onEmptyCellClick],
  );

  // 기존 오브젝트 클릭 핸들러 (백업용, 혹은 직접 클릭 시 사용)
  const onObjectClickInternal = useCallback(
    (e: ThreeEvent<MouseEvent>, objectId: string) => {
      e.stopPropagation();
      const matchingObject = objects.find((o) => o.id === objectId);
      if (matchingObject) {
        setClickedObjectId(objectId);
        onObjectClick(matchingObject);
      }
    },
    [objects, onObjectClick],
  );

  const setGlobalState = useCallback(
    (state: ObjectStateKey) => {
      setAllObjectsState(state, { setAsRestState: true });
    },
    [setAllObjectsState],
  );

  return {
    hoveredCell,
    clickedObjectId,
    objects,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onObjectClick: onObjectClickInternal,
    setGlobalState,
    setObjectState,
  };
}
