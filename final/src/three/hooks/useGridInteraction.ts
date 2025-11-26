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

export function useGridInteraction() {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [clickedObjectId, setClickedObjectId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [selectedBuilding, setSelectedBuilding] = useState<PlacedObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    objects,
    placeObject,
    deleteObject,
    updateObject,
    setObjectState,
    restoreRestState,
    setAllObjectsState,
    syncFromExternal,
  } = usePlacedObjects();

  const {
    buildings: remoteBuildings,
    isLoading,
    createBuilding,
    deleteBuilding,
    updateBuilding,
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

  // 그리드 클릭 시 새로운 오브젝트를 배치
  const onCellClick = useCallback(
    (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => {
      e.stopPropagation();
      const key = `${x}_${z}`;
      const existing = objectsByCell.get(key);

      if (existing) {
        // 건물이 있는 그리드 클릭 시 건물 클릭 이벤트로 처리
        setClickedObjectId(existing.id);
        // TODO: 건물로 카메라 줌인 로직은 별도로 구현 필요
      } else {
        setSelectedBuilding(null);
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
        // 건물 클릭 시 카메라 줌인
        setClickedObjectId(objectId);
        // TODO: 건물로 카메라 줌인 로직은 별도로 구현 필요
        
        // TODO: 건물 수정 부분 구현
        // setSelectedBuilding(matchingObject);
        // setPendingAction({ mode: "edit", buildingId: objectId });
        // setModalMode("edit");
        // setError(null);
        return;
      }

      // fallback: play clicked animation if not synced yet
      setObjectState(objectId, "clicked");
    },
    [objects, setObjectState],
  );

  // 호버 이벤트 제거 - 클릭 이벤트로 대체
  // const onObjectPointerOver = useCallback(
  //   (e: ThreeEvent<PointerEvent>, objectId: string) => {
  //     e.stopPropagation();
  //     setHoveredObjectId(objectId);
  //   },
  //   [],
  // );

  // const onObjectPointerOut = useCallback(
  //   (e: ThreeEvent<PointerEvent>, objectId: string) => {
  //     e.stopPropagation();
  //     setHoveredObjectId((prev) => (prev === objectId ? null : prev));
  //     restoreRestState(objectId);
  //   },
  //   [restoreRestState],
  // );

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
      meshIndex: number;
    }) => {
      if (!pendingAction) return;

      setError(null);

      try {
        if (pendingAction.mode === "create" && pendingAction.position) {
          const color = Math.random() * 0xffffff;
          await createBuilding(
            {
              position_x: pendingAction.position[0],
              position_y: pendingAction.position[1],
              position_z: pendingAction.position[2],
              color: Math.floor(color),
              mesh_index: data.meshIndex,
              title: data.title,
              author: data.author,
              message1: data.message1,
              message2: data.message2,
            },
            data.password,
          );
          setModalMode(null);
          setPendingAction(null);
        } else if (pendingAction.mode === "edit" && pendingAction.buildingId) {
          await updateBuilding(
            pendingAction.buildingId,
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
        } else if (pendingAction.mode === "delete" && pendingAction.buildingId) {
          await deleteBuilding(pendingAction.buildingId, data.password);
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
    [pendingAction, createBuilding, updateBuilding, deleteBuilding],
  );


  const handleModalClose = useCallback(() => {
    setModalMode(null);
    setPendingAction(null);
    setSelectedBuilding(null);
    setError(null);
  }, []);

  return {
    hoveredCell,
    clickedObjectId,
    objects,
    modalMode,
    selectedBuilding,
    error,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onObjectClick,
    // onObjectPointerOver,
    // onObjectPointerOut,
    setGlobalState,
    setObjectState,
    handleModalSubmit,
    handleModalClose,
  };
}
