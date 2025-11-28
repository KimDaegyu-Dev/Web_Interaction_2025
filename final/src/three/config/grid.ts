export const GRID_CONFIG = {
  CELL_SIZE: 5,
  CELL_PADDING: 0,
  FLOOR_LEVEL: 0,
  // Object placement height (typically slightly above floor or at specific level)
  DEFAULT_OBJECT_Y: 1, 
  GRID_Y_OFFSET: 0,
  COLORS: {
    BACKGROUND: "#f5f5f5",
    HIGHLIGHT_DEFAULT: 0x4a90e2,
    EMISSIVE_DEFAULT: 0x4a90e2,
  },
  OPACITY: {
    DEFAULT: 0.7,
  },
  // Cursor influence radius (used for background gradient and building visibility)
  CURSOR_INFLUENCE_RADIUS: 20.0,
} as const;
