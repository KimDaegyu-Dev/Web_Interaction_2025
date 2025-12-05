export const GRID_CONFIG = {
  /** 그리드 셀 크기 */
  CELL_SIZE: 5,
  /** 셀 간 패딩 */
  CELL_PADDING: 0,
  /** 바닥 레벨 */
  FLOOR_LEVEL: 0,
  /** 오브젝트 기본 Y 높이 */
  DEFAULT_OBJECT_Y: 0,
  /** 그리드 Y 오프셋 */
  GRID_Y_OFFSET: 0,
  
  COLORS: {
    BACKGROUND: "#f5f5f5",
    HIGHLIGHT_DEFAULT: 0x4a90e2,
    EMISSIVE_DEFAULT: 0x4a90e2,
  },
  
  OPACITY: {
    DEFAULT: 0.7,
  },
  
  /** 커서 영향 반경 (배경 그라데이션 및 건물 가시성) */
  CURSOR_INFLUENCE_RADIUS: 20.0,
  
  /** 도로 클러스터링 설정 */
  CLUSTER: {
    /** 클러스터 최대 가로 크기 (그리드 셀 단위) */
    MAX_WIDTH: 5,
    /** 클러스터 최대 세로 크기 (그리드 셀 단위) */
    MAX_HEIGHT: 7,
    /** 거리 기반 근접 임계값 (Manhattan Distance) */
    NEAR_THRESHOLD: 4,
  },
  
  /** 도로 설정 */
  ROAD: {
    /** 도로 폭 (월드 유닛) */
    WIDTH: 1.6,
    /** 도로 색상 */
    COLOR: "#888888",
  },
} as const;
