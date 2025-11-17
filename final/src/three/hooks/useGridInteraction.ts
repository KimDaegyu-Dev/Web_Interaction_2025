import { useState, useCallback, useEffect } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { useCubes } from "./useCubes";

interface GridCell {
  x: number;
  z: number;
}

export interface Cube {
  id: string;
  position: [number, number, number];
  color: number;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
}

type ModalMode = "create" | "edit" | "delete" | null;

interface PendingAction {
  mode: "create" | "edit" | "delete";
  position?: [number, number, number];
  cubeId?: string;
}

export function useGridInteraction() {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [selectedCube, setSelectedCube] = useState<Cube | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { cubes, isLoading, createCube, deleteCube, updateCube, clearCubes } =
    useCubes();

  // Shift 키 상태 추적
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 그리드 셀 호버
  const onCellPointerOver = useCallback((x: number, z: number) => {
    setHoveredCell({ x, z });
  }, []);

  const onCellPointerOut = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // 클릭으로 큐브 생성 또는 제거
  const onCellClick = useCallback(
    (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => {
      e.stopPropagation();

      // 이미 해당 위치에 큐브가 있는지 확인
      const existingCube = cubes.find(
        (cube) => cube.position[0] === x && cube.position[2] === z,
      );

      if (existingCube) {
        // 큐브가 있으면 삭제 모달 열기
        setSelectedCube(existingCube);
        setPendingAction({ mode: "delete", cubeId: existingCube.id });
        setModalMode("delete");
        setError(null);
      } else {
        // 큐브가 없으면 생성 모달 열기
        setSelectedCube(null);
        setPendingAction({ mode: "create", position: [x, y, z] });
        setModalMode("create");
        setError(null);
      }
    },
    [cubes],
  );

  // 큐브 클릭 (수정 모달 열기)
  const onCubeClick = useCallback(
    (e: ThreeEvent<MouseEvent>, cubeId: string) => {
      e.stopPropagation();

      const cube = cubes.find((c) => c.id === cubeId);
      if (cube) {
        setSelectedCube(cube);
        setPendingAction({ mode: "edit", cubeId });
        setModalMode("edit");
        setError(null);
      }
    },
    [cubes],
  );

  // 모달 제출 핸들러
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
      } catch (error) {
        console.error("Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
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
    cubes,
    isShiftPressed,
    isLoading,
    modalMode,
    selectedCube,
    error,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onCubeClick,
    clearCubes,
    handleModalSubmit,
    handleModalClose,
  };
}
