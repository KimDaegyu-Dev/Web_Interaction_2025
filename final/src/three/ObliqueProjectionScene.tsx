import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import { MainCamera } from "./cameras/MainCamera";
import { Lights } from "./lights/Lights";
import { Room } from "./components/Room";
import { InteractiveDisplayObjects } from "./components/DisplayObjects/InteractiveDisplayObjects";
import { Decorations } from "./components/Decorations";
import { useObliqueProjection } from "./hooks/useObliqueProjection";
import { useObliqueControls } from "./hooks/useObliqueControls";
import { useGridInteraction } from "./hooks/useGridInteraction";
import { calculateObliqueMatrix } from "./utils/projection";
import { DEFAULT_PARAMS, PRESETS } from "./config/presets";
import type { ProjectionParams } from "./config/types";
import { useDebugMode } from "../utils";

function Scene() {
  const gridGroupRef = useRef<THREE.Group>(null);
  const objectGroupRef = useRef<THREE.Group>(null);
  const debugMode = useDebugMode();

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
  } = useGridInteraction();

  // Leva GUI 컨트롤 - #debug가 있을 때만 활성화
  const params = useControls(
    "Projection",
    {
      thetaX: {
        value: DEFAULT_PARAMS.thetaX,
        min: 0,
        max: 360,
        step: 1,
      },
      thetaY: {
        value: DEFAULT_PARAMS.thetaY,
        min: 0,
        max: 360,
        step: 1,
      },
      thetaZ: {
        value: DEFAULT_PARAMS.thetaZ,
        min: 0,
        max: 360,
        step: 1,
      },
      scaleX: {
        value: DEFAULT_PARAMS.scaleX,
        min: 0.1,
        max: 2,
        step: 0.01,
      },
      scaleY: {
        value: DEFAULT_PARAMS.scaleY,
        min: 0.1,
        max: 2,
        step: 0.01,
      },
      scaleZ: {
        value: DEFAULT_PARAMS.scaleZ,
        min: 0.1,
        max: 2,
        step: 0.01,
      },
    },
    { render: () => debugMode },
  ) as ProjectionParams;

  // 프리셋 버튼 - #debug가 있을 때만 활성화
  useControls(
    "Presets" as const,
    {
      Isometric: {
        value: () => {
          Object.assign(params, PRESETS.Isometric);
        },
      },
      Dimetric: {
        value: () => {
          Object.assign(params, PRESETS.Dimetric);
        },
      },
      FrontOblique: {
        value: () => {
          Object.assign(params, PRESETS.FrontOblique);
        },
      },
      Cabinet: {
        value: () => {
          Object.assign(params, PRESETS.Cabinet);
        },
      },
    },
    { render: () => debugMode },
  );

  // Oblique 투영 적용 - 그리드와 오브젝트 모두에
  useObliqueProjection(gridGroupRef, params, getPanOffset);
  useObliqueProjection(objectGroupRef, params, getPanOffset);

  // Oblique 투영 행렬 계산 (그리드에서 역변환에 사용)
  // panOffset은 매 프레임 변하므로 실시간으로 계산
  const getObliqueMatrix = () => {
    const panOffset = getPanOffset();
    return calculateObliqueMatrix(params, panOffset);
  };

  return (
    <>
      <MainCamera />
      <Lights />

      {/* 그리드 - Oblique 투영 적용 */}
      <group ref={gridGroupRef}>
        <Room
          useGridFloor={true}
          gridFloorProps={{
            gridSize: 1,
            viewportGridSize: 30,
            getPanOffset,
            getObliqueMatrix, // Oblique 행렬 생성 함수 전달 (역변환용)
            onCellPointerOver,
            onCellPointerOut,
            onCellClick,
            hoveredCell,
            isShiftPressed,
          }}
        />
      </group>

      {/* 오브젝트들 - Oblique 투영 적용 */}
      <group ref={objectGroupRef}>
        <InteractiveDisplayObjects
          dynamicCubes={cubes}
          onCubeClick={onCubeClick}
        />
        <Decorations />
      </group>

      {/* 좌표축 헬퍼 */}
      <axesHelper args={[2]} />
    </>
  );
}

export function ObliqueProjectionScene() {
  return (
    <div className="h-screen w-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        <Scene />
      </Canvas>
    </div>
  );
}
