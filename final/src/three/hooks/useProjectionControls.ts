import { useControls, button } from "leva";
import { DEFAULT_PARAMS, PRESETS } from "../config/presets";
import type { ProjectionParams } from "../config/types";
import { useDebugMode } from "../../utils";

/**
 * Oblique 투영 파라미터를 제어하는 Leva GUI 훅
 */
export function useProjectionControls() {
  const debugMode = useDebugMode();

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
      cameraX: {
        value: DEFAULT_PARAMS.cameraX,
        min: -50,
        max: 50,
        step: 0.1,
      },
      cameraY: {
        value: DEFAULT_PARAMS.cameraY,
        min: -50,
        max: 50,
        step: 0.1,
      },
      cameraZ: {
        value: DEFAULT_PARAMS.cameraZ,
        min: -50,
        max: 50,
        step: 0.1,
      },
      cameraRotX: {
        value: DEFAULT_PARAMS.cameraRotX,
        min: -180,
        max: 180,
        step: 1,
      },
      cameraRotY: {
        value: DEFAULT_PARAMS.cameraRotY,
        min: -180,
        max: 180,
        step: 1,
      },
      cameraRotZ: {
        value: DEFAULT_PARAMS.cameraRotZ,
        min: -180,
        max: 180,
        step: 1,
      },
      gridRotation: {
        value: DEFAULT_PARAMS.gridRotation,
        min: 0,
        max: 360,
        step: 1,
      },
    },
    { render: () => debugMode },
  ) as ProjectionParams;

  // 프리셋 버튼
  useControls(
    "Presets" as const,
    {
      Isometric: button(() => {
        Object.assign(params, PRESETS.Isometric);
      }),
      Dimetric: button(() => {
        Object.assign(params, PRESETS.Dimetric);
      }),
      FrontOblique: button(() => {
        Object.assign(params, PRESETS.FrontOblique);
      }),
      Cabinet: button(() => {
        Object.assign(params, PRESETS.Cabinet);
      }),
    },
    { render: () => debugMode },
  );

  return params;
}
