/** 아이소메트릭 카메라 설정 */
export const CAMERA_CONFIG = {
  /** 카메라 줌 레벨 */
  ZOOM: 50,
  /** Near plane */
  NEAR: 0.1,
  /** Far plane */
  FAR: 1000,
  /** 카메라 위치 */
  POSITION: [20, 20, 20] as [number, number, number],
  /** 카메라 타겟 */
  TARGET: [0, 0, 0] as [number, number, number],
} as const;

/** 건물 모델 설정 */
export const BUILDING_CONFIG = {
  /** 기본 색상 (흰색) */
  DEFAULT_COLOR: 0xffffff,
  /** 텍스트 색상 (검정) */
  TEXT_COLOR: "#000000",
  /** 텍스트 폰트 크기 */
  TEXT_SIZE: 0.25,
  /** 텍스트 최대 글자수 */
  TEXT_MAX_LENGTH: 10,
  /** 엣지 라인 색상 (검정) */
  EDGE_COLOR: "#000000",
  /** 엣지 라인 두께 */
  EDGE_WIDTH: 1.5,
} as const;

/** 화환 설정 */
export const WREATH_CONFIG = {
  /** 화환 시작 높이 */
  DROP_HEIGHT: 15,
  /** 화환 크기 */
  SIZE: [2, 3] as [number, number],
  /** 물리 시뮬레이션 설정 */
  PHYSICS: {
    MASS: 1,
    RESTITUTION: 0.2,
    FRICTION: 0.5,
  },
} as const;

/** 물리 엔진 설정 */
export const PHYSICS_CONFIG = {
  /** 중력 */
  GRAVITY: [0, -9.81, 0] as [number, number, number],
  /** 시뮬레이션 스텝 */
  STEP: 1 / 60,
} as const;
