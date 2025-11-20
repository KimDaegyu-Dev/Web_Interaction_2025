import { useCallback, useEffect, useMemo, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import {
  usePlacedObjects,
  type SceneObjectInstance,
} from "./usePlacedObjects";
import type { ObjectStateKey } from "../objectSystem/modelLibrary";
import { useCubes } from "./useCubes";

interface GridCell {
  x: number;
  z: number;
}

export type PlacedObject = SceneObjectInstance;
export type Cube = SceneObjectInstance;

type ModalMode = "create" | "edit" | "delete" | null;

interface PendingAction {
  mode: "create" | "edit" | "delete";
  position?: [number, number, number];
  cubeId?: string;
}

export function useGridInteraction() {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [selectedCube, setSelectedCube] = useState<Cube | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    objects,
    setObjectState,
    restoreRestState,
    setAllObjectsState,
    syncFromExternal,
  } = usePlacedObjects();

  const {
    cubes: remoteCubes,
    isLoading,
    createCube,
    deleteCube,
    updateCube,
    clearCubes,
  } = useCubes();

  // Sync Supabase cubes into renderable glTF objects (keeps state if same id remains)
  useEffect(() => {
    const entries = remoteCubes.map((cube) => ({
      id: cube.id,
      position: cube.position,
      title: cube.title,
      author: cube.author,
      message1: cube.message1,
      message2: cube.message2,
    }));
    syncFromExternal(entries);
  }, [remoteCubes, syncFromExternal]);

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

  // 그리드 클릭 시 새로운 오브젝트를 배치
  const onCellClick = useCallback(
    (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => {
      e.stopPropagation();
      const key = `${x}_${z}`;
      const existing = objectsByCell.get(key);

      if (existing) {
        setSelectedCube(existing);
        setPendingAction({ mode: "delete", cubeId: existing.id });
        setModalMode("delete");
        setError(null);
      } else {
        setSelectedCube(null);
        setPendingAction({ mode: "create", position: [x, y, z] });
        setModalMode("create");
        setError(null);
      }
    },
    [objectsByCell],
  );

  const onObjectClick = useCallback(
    (e: ThreeEvent<MouseEvent>, objectId: string) => {
      e.stopPropagation();
      const matchingObject = objects.find((o) => o.id === objectId);
      if (matchingObject) {
        setSelectedCube(matchingObject);
        setPendingAction({ mode: "edit", cubeId: objectId });
        setModalMode("edit");
        setError(null);
        return;
      }

      // fallback: play clicked animation if not synced yet
      setObjectState(objectId, "clicked");
    },
    [objects, setObjectState],
  );

  const onObjectPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>, objectId: string) => {
      e.stopPropagation();
      setHoveredObjectId(objectId);
      // Hover state removed as per refactoring
    },
    [],
  );

  const onObjectPointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>, objectId: string) => {
      e.stopPropagation();
      setHoveredObjectId((prev) => (prev === objectId ? null : prev));
      restoreRestState(objectId);
    },
    [restoreRestState],
  );

  const setGlobalState = useCallback(
    (state: ObjectStateKey) => {
      setAllObjectsState(state, { setAsRestState: true });
    },
    [setAllObjectsState],
  );

  const handleModalSubmit = useCallback(
    async (data: {
      password: string;
      title?: string;
      author?: string;
      message1?: string;
      message2?: string;
    }) => {
      if (!pendingAction) return;

      setError(null);

      try {
        if (pendingAction.mode === "create" && pendingAction.position) {
          const color = Math.random() * 0xffffff;
          await createCube(
            {
              position_x: pendingAction.position[0],
              position_y: pendingAction.position[1],
              position_z: pendingAction.position[2],
              color: Math.floor(color),
              title: data.title,
              author: data.author,
              message1: data.message1,
              message2: data.message2,
            },
            data.password,
          );
          setModalMode(null);
          setPendingAction(null);
        } else if (pendingAction.mode === "edit" && pendingAction.cubeId) {
          await updateCube(
            pendingAction.cubeId,
            {
              title: data.title,
              author: data.author,
              message1: data.message1,
              message2: data.message2,
            },
            data.password,
          );
          setModalMode(null);
          setPendingAction(null);
        } else if (pendingAction.mode === "delete" && pendingAction.cubeId) {
          await deleteCube(pendingAction.cubeId, data.password);
          setModalMode(null);
          setPendingAction(null);
        }
      } catch (err) {
        console.error("Error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "작업 중 오류가 발생했습니다. 패스워드를 확인해주세요.";
        setError(errorMessage);
      }
    },
    [pendingAction, createCube, updateCube, deleteCube],
  );

  const handleModalClose = useCallback(() => {
    setModalMode(null);
    setPendingAction(null);
    setSelectedCube(null);
    setError(null);
  }, []);

  return {
    hoveredCell,
    hoveredObjectId,
    objects,
    modalMode,
    selectedCube,
    error,
    isLoading,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onObjectClick,
    onObjectPointerOver,
    onObjectPointerOut,
    setGlobalState,
    setObjectState,
    handleModalSubmit,
    handleModalClose,
    clearCubes,
  };
}
