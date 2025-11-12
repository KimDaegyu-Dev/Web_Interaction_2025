import { useState, useCallback, useEffect } from "react";
import { ThreeEvent } from "@react-three/fiber";

interface GridCell {
  x: number;
  z: number;
}

interface Cube {
  id: string;
  position: [number, number, number];
  color: number;
}

export function useGridInteraction() {
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

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

  // Shift + 클릭으로 큐브 생성 또는 제거
  const onCellClick = useCallback(
    (e: ThreeEvent<MouseEvent>, x: number, z: number) => {
      if (e.shiftKey) {
        e.stopPropagation();

        // 이미 해당 위치에 큐브가 있는지 확인
        const existingCube = cubes.find(
          (cube) => cube.position[0] === x && cube.position[2] === z,
        );

        if (existingCube) {
          // 큐브가 있으면 제거
          setCubes((prev) =>
            prev.filter((cube) => cube.id !== existingCube.id),
          );
        } else {
          // 큐브가 없으면 생성
          const newCube: Cube = {
            id: `cube-${Date.now()}-${Math.random()}`,
            position: [x, 0, z],
            color: Math.random() * 0xffffff,
          };
          setCubes((prev) => [...prev, newCube]);
        }
      }
    },
    [cubes],
  );

  // 큐브 삭제 (클릭으로)
  const onCubeClick = useCallback(
    (e: ThreeEvent<MouseEvent>, cubeId: string) => {
      if (e.shiftKey) {
        e.stopPropagation();
        setCubes((prev) => prev.filter((cube) => cube.id !== cubeId));
      }
    },
    [],
  );

  // 큐브 초기화
  const clearCubes = useCallback(() => {
    setCubes([]);
  }, []);

  return {
    hoveredCell,
    cubes,
    isShiftPressed,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onCubeClick,
    clearCubes,
  };
}
