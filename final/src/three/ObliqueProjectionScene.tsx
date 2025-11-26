import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { ObliqueCamera } from "./cameras/ObliqueCamera";
import { Lights } from "./lights/Lights";
import { InteractiveDisplayObjects } from "./components/DisplayObjects/InteractiveDisplayObjects";
import { GridHighlight } from "./components/Grid/GridHighlight";
import { GridFloor } from "./components/Grid/GridFloor";
import { InfiniteBackground } from "./components/Grid/InfiniteBackground";
import { EdgeZoneIndicator } from "./components/EdgeZoneIndicator";
import { useObliqueProjection } from "./hooks/useObliqueProjection";
import { useObliqueControls } from "./hooks/useObliqueControls";
import { useGridInteraction } from "./hooks/useGridInteraction";
import { useProjectionControls } from "./hooks/useProjectionControls";
import { useGridRaycasting } from "./hooks/useGridRaycasting";
import { screenToGridCoords } from "./utils/raycasting";
import { calculateObliqueMatrix } from "./utils/projection";
import { GRID_CONFIG } from "./config/grid";
import { BuildingModal } from "@/components/BuildingModal";

interface SceneProps {
  gridInteraction: ReturnType<typeof useGridInteraction>;
  mousePosition: { x: number; y: number } | null;
  controlsRef: React.MutableRefObject<{
    getEdgeZone: () => {
      left: boolean;
      right: boolean;
      top: boolean;
      bottom: boolean;
    };
  } | null>;
}

function Scene({ gridInteraction, mousePosition, controlsRef }: SceneProps) {
  const gridHighlightGroupRef = useRef<THREE.Group>(null);
  const objectGroupRef = useRef<THREE.Group>(null);
  const { scene, camera, gl } = useThree();


  // ObliqueControls 초기화 (패닝 & 줌)
  const { getPanOffset, getEdgeZone } = useObliqueControls();

  // controlsRef 업데이트
  useEffect(() => {
    controlsRef.current = { getEdgeZone };
  }, [controlsRef, getEdgeZone]);

  // Grid Interaction (Shift + 클릭으로 큐브 생성)
  const {
    hoveredCell,
    objects,
    clickedObjectId,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onObjectClick,
    setObjectState,
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

  // 배경색 설정
  useEffect(() => {
    scene.background = new THREE.Color(GRID_CONFIG.COLORS.BACKGROUND);
  }, [scene]);

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



// ... existing code ...

      if (gridCoords) {
        const syntheticEvent = {
          stopPropagation: () => {},
          point: new THREE.Vector3(
            gridCoords.x,
            GRID_CONFIG.DEFAULT_OBJECT_Y,
            gridCoords.z,
          ),
        } as ThreeEvent<MouseEvent>;

        onCellClick(
          syntheticEvent,
          gridCoords.x,
          GRID_CONFIG.DEFAULT_OBJECT_Y,
          gridCoords.z,
        );
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
  // useEffect(() => {
  //   const axesHelper = new THREE.AxesHelper(2);
  //   scene.add(axesHelper);
  //   return () => {
  //     scene.remove(axesHelper);
  //     axesHelper.dispose();
  //   };
  // }, [scene]);

  return (
    <>
      <ObliqueCamera />
      <Lights />

      {/* 그리드 강조 메시 */}
      <group ref={gridHighlightGroupRef}>
        <GridHighlight
          hoveredCell={hoveredCell}
        />
      </group>

      {/* Infinite Background rendered via Shader - Outside of transformed group */}
      <InfiniteBackground />

      {/* 오브젝트들 - Oblique 투영 적용 */}
      <group ref={objectGroupRef}>
        <GridFloor objects={objects} />
        <InteractiveDisplayObjects
          objects={objects}
          clickedObjectId={clickedObjectId}
          onObjectClick={onObjectClick}
          onRequestStateChange={setObjectState}
        />
      </group>
    </>
  );
}

export function ObliqueProjectionScene() {
  const gridInteraction = useGridInteraction();
  const {
    modalMode: buildingModalMode,
    selectedBuilding,
    error,
    handleModalSubmit,
    handleModalClose,
  } = gridInteraction;
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // 초기 마우스 위치를 화면 중앙으로 설정
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(() => {
    // 초기값을 화면 중앙으로 설정
    if (typeof window !== "undefined") {
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    }
    return null;
  });

  // EdgeZoneIndicator를 위한 controls 참조
  const controlsRef = useRef<{
    getEdgeZone: () => {
      left: boolean;
      right: boolean;
      top: boolean;
      bottom: boolean;
    };
  } | null>(null);

  // Canvas 마운트 후 마우스 위치를 중앙으로 설정
  useEffect(() => {
    const updateCenterPosition = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        setMousePosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      } else {
        // Canvas가 아직 마운트되지 않았으면 화면 중앙 사용
        setMousePosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }
    };

    // 초기 설정
    updateCenterPosition();

    // 리사이즈 시에도 중앙 유지
    window.addEventListener("resize", updateCenterPosition);
    return () => {
      window.removeEventListener("resize", updateCenterPosition);
    };
  }, []);

  return (
    <div ref={canvasContainerRef} className="relative h-screen w-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
        }}
        onPointerMove={(e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onPointerLeave={() => {
          // 포인터가 나가도 중앙 위치 유지
          if (canvasContainerRef.current) {
            const rect = canvasContainerRef.current.getBoundingClientRect();
            setMousePosition({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            });
          }
          gridInteraction.onCellPointerOut();
        }}
        onPointerMissed={() => {
          gridInteraction.onCellPointerOut();
        }}
      >
        <Scene
          gridInteraction={gridInteraction}
          mousePosition={mousePosition}
          controlsRef={controlsRef}
        />
      </Canvas>
      {/* 가장자리 영역 표시기 */}
      <EdgeZoneIndicator
        getEdgeZone={() =>
          controlsRef.current?.getEdgeZone() || {
            left: false,
            right: false,
            top: false,
            bottom: false,
          }
        }
        thresholdX={300}
        thresholdY={300}
        mousePosition={mousePosition}
      />
      {buildingModalMode && (
        <BuildingModal
          isOpen={!!buildingModalMode}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          mode={buildingModalMode}
          building={selectedBuilding || undefined}
          error={error}
        />
      )}
    </div>
  );
}
