// 투영 파라미터 타입
export interface ProjectionParams {
  thetaX: number;
  thetaY: number;
  thetaZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  cameraRotX: number;
  cameraRotY: number;
  cameraRotZ: number;
  gridRotation: number;
}

// 프리셋 타입
export type PresetName = 'Isometric' | 'Dimetric' | 'FrontOblique' | 'Cabinet';

export interface Preset {
  thetaX: number;
  thetaY: number;
  thetaZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  cameraX?: number;
  cameraY?: number;
  cameraZ?: number;
  cameraRotX?: number;
  cameraRotY?: number;
  cameraRotZ?: number;
  gridRotation?: number;
}

