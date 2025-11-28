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
      backgroundLightMode: {
        value: "buildings" as "buildings" | "cursors",
        options: ["buildings", "cursors"],
        label: "Background Light",
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
