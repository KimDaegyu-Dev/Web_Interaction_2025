export const MODEL_CONFIG = {
  DEFAULT_SCALE: [1.4, 1.4, 1.4] as [number, number, number],
  DEFAULT_ROTATION: [0, Math.PI / 2, 0] as [number, number, number],
  DEFAULT_POSITION_OFFSET: [0, 0, 0] as [number, number, number],
  SCALE_MULTIPLIER: 0.05,
  HOVER_SCALE_FACTOR: 1.05,
  ANIMATION: {
    CROSS_FADE_DURATION: 0.25,
    DEFAULT_CROSS_FADE: 0.3,
  },
  // Model loading strategy: "single_glb" (all models in one file) or "individual" (separate files)
  LOAD_STRATEGY: "single_glb" as "single_glb" | "individual",
  // Base URL for models if using individual strategy
  BASE_URL: "models/",
  // Shared GLB URL if using single_glb strategy
  SHARED_GLB_URL: "models/building.glb",
  BUILDING_TYPES: [
    { key: "cons_giyuk", name: "ㄱ (Giyuk)", nodeName: "Cons_Giyuk" },
    { key: "cons_nieun", name: "ㄴ (Nieun)", nodeName: "Cons_Nieun" },
    { key: "cons_digeut", name: "ㄷ (Digeut)", nodeName: "Cons_Digeut" },
    // Add more types as needed
  ],
} as const;
