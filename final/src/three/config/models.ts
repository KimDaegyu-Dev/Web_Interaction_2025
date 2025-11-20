export const MODEL_CONFIG = {
  DEFAULT_SCALE: [1.4, 1.4, 1.4] as [number, number, number],
  DEFAULT_ROTATION: [0, Math.PI / 2, 0] as [number, number, number],
  SCALE_MULTIPLIER: 0.05,
  HOVER_SCALE_FACTOR: 1.05,
  ANIMATION: {
    CROSS_FADE_DURATION: 0.25,
    DEFAULT_CROSS_FADE: 0.3,
  },
} as const;
