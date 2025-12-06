import { useCallback, useState, useEffect, useMemo } from "react";
import {
  useBuildingPersistence,
  type Building,
} from "./useBuildingPersistence";
import type { PlacedObject, GridCell } from "../config/types";
import { useAuthStore } from "@/stores/authStore";

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
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
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
      })),
    [buildings]
  );

  // 셀 좌표로 건물 찾기 (DB 좌표 기준으로 비교)
  const findBuildingByCell = useCallback(
    (x: number, z: number): Building | undefined => {
      return buildings.find((b) => {
        // dbPosition은 정수형 셀 좌표 (0, 5, 10...)
        return b.dbPosition[0] === x && b.dbPosition[2] === z;
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

  // 그리드 클릭 (빈 셀 + 건물 통합)
  // 실시간 커서 위치(hoveredCell) 기반으로 동작
  const onCellClick = useCallback(
    (onBuildingNavigate?: (buildingId: string) => void) => {
      // hoveredCell이 없으면 클릭 무시 (커서가 그리드 위에 없음)
      if (!hoveredCell) {
        console.log("[onCellClick] No hovered cell");
        return;
      }
      
      const { x, z } = hoveredCell;
      const existing = findBuildingByCell(x, z);

      if (existing) {
        // 기존 건물 클릭 -> 상세 페이지로 이동
        console.log(
          "[onCellClick] Building found, navigating to:",
          existing.id
        );
        if (onBuildingNavigate) {
          onBuildingNavigate(existing.id);
        }
      } else {
        // 빈 셀 클릭 -> 새 건물 배치 모달 열기
        // 익명 사용자 체크
        const isAnonymous = useAuthStore.getState().isAnonymous();
        if (isAnonymous) {
          setError("방문자는 건물을 생성할 수 없습니다. 로그인이 필요합니다.");
          return;
        }

        console.log("[onCellClick] Empty cell, opening create modal at:", x, z);
        setSelectedBuildingId(null);
        setPendingAction({ mode: "create", position: [x, 0, z] });
        setModalMode("create");
      }
    },
    [hoveredCell, findBuildingByCell]
  );

  // 건물 생성 확인
  const confirmCreate = useCallback(
    async (data: {
      title: string;
      buildingText: string;
      meshIndex: number;
    }) => {
      if (!pendingAction?.position) return;

      // 익명 사용자 체크
      const isAnonymous = useAuthStore.getState().isAnonymous();
      if (isAnonymous) {
        setError("방문자는 건물을 생성할 수 없습니다. 로그인이 필요합니다.");
        return;
      }

      const [x, y, z] = pendingAction.position;
      
      const result = await createBuilding(
        {
          position_x: x,
          position_y: y,
          position_z: z,
          color: 0xffffff,
          mesh_index: data.meshIndex,
          building_text: data.buildingText.slice(0, 50), // 50자 제한
          title: data.title,
        },
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
  const confirmDelete = useCallback(async () => {
      if (!selectedBuildingId) return;

    // 익명 사용자 체크
    const isAnonymous = useAuthStore.getState().isAnonymous();
    if (isAnonymous) {
      setError("방문자는 건물을 삭제할 수 없습니다. 로그인이 필요합니다.");
      return;
    }

    const success = await deleteBuilding(selectedBuildingId);

      if (success) {
        setSelectedBuildingId(null);
        setModalMode(null);
      } else {
      setError("건물 삭제에 실패했습니다.");
      }
  }, [selectedBuildingId, deleteBuilding]);

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
    
    // 액션
    setModalMode,
    confirmCreate,
    confirmDelete,
    closeModal,
    setSelectedBuildingId,
  };
}
