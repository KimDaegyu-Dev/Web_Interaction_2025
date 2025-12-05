import { useCallback, useState, useEffect, useMemo } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { useBuildingPersistence, type Building } from "./useBuildingPersistence";
import type { PlacedObject, GridCell } from "../config/types";
import { GRID_CONFIG } from "../config/grid";

type ModalMode = "create" | "edit" | "delete" | null;

interface PendingAction {
  mode: "create" | "edit" | "delete";
  position?: [number, number, number];
  buildingId?: string;
}

/**
 * 그리드 인터랙션 훅
 * 건물 배치, 선택, 수정, 삭제 관리
 */
export function useGridInteraction() {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    buildings,
    isLoading,
    createBuilding,
    deleteBuilding,
    updateBuilding,
  } = useBuildingPersistence();

  // Building -> PlacedObject 변환
  const placedObjects: PlacedObject[] = useMemo(
    () =>
      buildings.map((b) => ({
        id: b.id,
        position: b.position,
        rotation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number],
        meshIndex: b.meshIndex,
        buildingStructure: b.buildingStructure,
        buildingText: b.buildingText,
        title: b.title,
        author: b.author,
      })),
    [buildings]
  );

  // 셀 좌표로 건물 찾기
  const findBuildingByCell = useCallback(
    (x: number, z: number): Building | undefined => {
      const cellSize = GRID_CONFIG.CELL_SIZE;
      return buildings.find((b) => {
        const bx = Math.floor(b.position[0] / cellSize) * cellSize;
        const bz = Math.floor(b.position[2] / cellSize) * cellSize;
        return bx === x && bz === z;
      });
    },
    [buildings]
  );

  // 그리드 셀 호버
  const onCellPointerOver = useCallback((x: number, z: number) => {
    setHoveredCell({ x, z });
  }, []);

  const onCellPointerOut = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // 그리드 클릭
  const onCellClick = useCallback(
    (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => {
      e.stopPropagation();
      
      const existing = findBuildingByCell(x, z);

      if (existing) {
        // 기존 건물 선택
        setSelectedBuildingId(existing.id);
      } else {
        // 새 건물 배치 모달 열기
        setSelectedBuildingId(null);
        setPendingAction({ mode: "create", position: [x, y, z] });
        setModalMode("create");
      }
    },
    [findBuildingByCell]
  );

  // 건물 클릭
  const onBuildingClick = useCallback(
    (e: ThreeEvent<MouseEvent>, buildingId: string) => {
      e.stopPropagation();
      setSelectedBuildingId(buildingId);
    },
    []
  );

  // 건물 생성 확인
  const confirmCreate = useCallback(
    async (data: {
      title: string;
      author: string;
      buildingText: string;
      meshIndex: number;
      password: string;
    }) => {
      if (!pendingAction?.position) return;

      const [x, y, z] = pendingAction.position;
      
      const result = await createBuilding(
        {
          position_x: x,
          position_y: y,
          position_z: z,
          color: 0xffffff,
          mesh_index: data.meshIndex,
          building_text: data.buildingText.slice(0, 10), // 10자 제한
          title: data.title,
          author: data.author,
        },
        data.password,
        data.meshIndex
      );

      if (result) {
        setModalMode(null);
        setPendingAction(null);
      } else {
        setError("건물 생성에 실패했습니다.");
      }
    },
    [pendingAction, createBuilding]
  );

  // 건물 삭제 확인
  const confirmDelete = useCallback(
    async (password: string) => {
      if (!selectedBuildingId) return;

      const success = await deleteBuilding(selectedBuildingId, password);

      if (success) {
        setSelectedBuildingId(null);
        setModalMode(null);
      } else {
        setError("비밀번호가 일치하지 않습니다.");
      }
    },
    [selectedBuildingId, deleteBuilding]
  );

  // 모달 닫기
  const closeModal = useCallback(() => {
    setModalMode(null);
    setPendingAction(null);
    setError(null);
  }, []);

  // 선택된 건물 정보
  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedBuildingId) || null,
    [buildings, selectedBuildingId]
  );

  return {
    // 상태
    hoveredCell,
    selectedBuildingId,
    selectedBuilding,
    modalMode,
    pendingAction,
    error,
    isLoading,
    
    // 데이터
    buildings,
    placedObjects,
    
    // 이벤트 핸들러
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onBuildingClick,
    
    // 액션
    setModalMode,
    confirmCreate,
    confirmDelete,
    closeModal,
    setSelectedBuildingId,
  };
}
