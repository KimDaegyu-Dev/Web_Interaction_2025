import type { Preset, PresetName } from './types';

// 프리셋 정의
export const PRESETS: Record<PresetName, Preset> = {
  Isometric: {
    thetaX: 330, // x축: 오른쪽 아래로 30도
    thetaY: 90, // y축: 위로
    thetaZ: 210, // z축: 왼쪽 아래로 30도
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    cameraX: 1,
    cameraY: 5,
    cameraZ: 5,
    cameraRotX: 0,
    cameraRotY: 0,
    cameraRotZ: 0,
    gridRotation: 0,
  },
  Dimetric: {
    thetaX: 335, // x축: 약간 더 오른쪽 아래
    thetaY: 90, // y축: 위로
    thetaZ: 205, // z축: 약간 덜 왼쪽
    scaleX: 1,
    scaleY: 1,
    scaleZ: 0.5, // z축 스케일 줄임
    cameraX: 1,
    cameraY: 5,
    cameraZ: 5,
    cameraRotX: 0,
    cameraRotY: 0,
    cameraRotZ: 0,
    gridRotation: 0,
  },
  FrontOblique: {
    thetaX: 0,
    thetaY: 90,
    thetaZ: 225,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 0.7,
    cameraX: 1,
    cameraY: 5,
    cameraZ: 5,
    cameraRotX: 0,
    cameraRotY: 0,
    cameraRotZ: 0,
    gridRotation: 0,
  },
  Cabinet: {
    thetaX: 0,
    thetaY: 90,
    thetaZ: 225,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 0.5,
    cameraX: 1,
    cameraY: 5,
    cameraZ: 5,
    cameraRotX: 0,
    cameraRotY: 0,
    cameraRotZ: 0,
    gridRotation: 0,
  },
};

// 기본 파라미터
export const DEFAULT_PARAMS: Preset = PRESETS.Isometric;

