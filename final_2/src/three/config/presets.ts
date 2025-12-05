import type { Preset, PresetName } from "./types";

/**
 * Oblique 투영 프리셋 정의
 */
export const PRESETS: Record<PresetName, Preset> = {
  Isometric: {
    thetaX: 330, // x축: 오른쪽 아래로 30도
    thetaY: 90, // y축: 위로
    thetaZ: 210, // z축: 왼쪽 아래로 30도
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
  },
  Dimetric: {
    thetaX: 335, // x축: 약간 더 오른쪽 아래
    thetaY: 90, // y축: 위로
    thetaZ: 205, // z축: 약간 덜 왼쪽
    scaleX: 1,
    scaleY: 1,
    scaleZ: 0.5, // z축 스케일 줄임
  },
  FrontOblique: {
    thetaX: 0,
    thetaY: 90,
    thetaZ: 225,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 0.7,
  },
  Cabinet: {
    thetaX: 0,
    thetaY: 90,
    thetaZ: 225,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 0.5,
  },
};

/**
 * 기본 투영 파라미터 (Isometric)
 */
export const DEFAULT_PROJECTION_PARAMS: Preset = PRESETS.Isometric;
