import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { ObliqueCamera } from "./cameras/ObliqueCamera";
import { Lights } from "./lights/Lights";
import { InteractiveDisplayObjects } from "./components/DisplayObjects/InteractiveDisplayObjects";
import { GridHighlight } from "./components/Grid/GridHighlight";
import { useObliqueProjection } from "./hooks/useObliqueProjection";
import { useObliqueControls } from "./hooks/useObliqueControls";
import { useGridInteraction } from "./hooks/useGridInteraction";
import { useProjectionControls } from "./hooks/useProjectionControls";
import { useGridRaycasting } from "./hooks/useGridRaycasting";
import { screenToGridCoords } from "./utils/raycasting";
import { calculateObliqueMatrix } from "./utils/projection";

interface SceneProps {
  gridInteraction: ReturnType<typeof useGridInteraction>;
  mousePosition: { x: number; y: number } | null;
}

function Scene({ gridInteraction, mousePosition }: SceneProps) {
  const gridHighlightGroupRef = useRef<THREE.Group>(null);
  const objectGroupRef = useRef<THREE.Group>(null);
  const { scene, camera, gl } = useThree();

  // 배경색 설정
  useEffect(() => {
    scene.background = new THREE.Color("#f5f5f5");
  }, [scene]);

  // ObliqueControls 초기화 (패닝 & 줌)
  const { getPanOffset } = useObliqueControls();

  // Grid Interaction (Shift + 클릭으로 큐브 생성)
  const {
    hoveredCell,
    cubes,
    isShiftPressed,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onCubeClick,
  } = gridInteraction;

  // 투영 파라미터 컨트롤
  const projectionParams = useProjectionControls();

  // Oblique 투영 행렬 계산
  const getObliqueMatrix = useCallback(() => {
    const panOffset = getPanOffset();
    return calculateObliqueMatrix(projectionParams, panOffset);
  }, [projectionParams, getPanOffset]);

  // 그리드 레이캐스팅 (마우스 호버)
  useGridRaycasting({
    mousePosition,
    projectionParams,
    getPanOffset,
    onCellPointerOver,
    onCellPointerOut,
  });

  // 클릭 이벤트 핸들러
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const obliqueMatrix = getObliqueMatrix();
      const inverseMatrix = obliqueMatrix.clone().invert();

      const gridCoords = screenToGridCoords(
        e.clientX,
        e.clientY,
        camera,
        gl,
        inverseMatrix,
      );

      if (gridCoords) {
        const syntheticEvent = {
          stopPropagation: () => {},
          shiftKey: e.shiftKey,
          point: new THREE.Vector3(gridCoords.x, -3, gridCoords.z),
        } as ThreeEvent<MouseEvent>;

        onCellClick(syntheticEvent, gridCoords.x, gridCoords.z);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl, camera, getObliqueMatrix, onCellClick]);

  // Oblique 투영 적용
  useObliqueProjection(gridHighlightGroupRef, projectionParams, getPanOffset);
  useObliqueProjection(objectGroupRef, projectionParams, getPanOffset);

  // AxesHelper 추가
  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    return () => {
      scene.remove(axesHelper);
      axesHelper.dispose();
    };
  }, [scene]);

  return (
    <>
      <ObliqueCamera />
      <Lights />

      {/* 그리드 강조 메시 */}
      <group ref={gridHighlightGroupRef}>
        <GridHighlight
          hoveredCell={hoveredCell}
          isShiftPressed={isShiftPressed}
        />
      </group>

      {/* 오브젝트들 - Oblique 투영 적용 */}
      <group ref={objectGroupRef}>
        <InteractiveDisplayObjects
          dynamicCubes={cubes}
          onCubeClick={onCubeClick}
        />
      </group>
    </>
  );
}

export function ObliqueProjectionScene() {
  const gridInteraction = useGridInteraction();
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="h-screen w-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
        }}
        onPointerMove={(e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onPointerLeave={() => {
          setMousePosition(null);
          gridInteraction.onCellPointerOut();
        }}
        onPointerMissed={() => {
          gridInteraction.onCellPointerOut();
        }}
      >
        <Scene
          gridInteraction={gridInteraction}
          mousePosition={mousePosition}
        />
      </Canvas>
    </div>
  );
}
