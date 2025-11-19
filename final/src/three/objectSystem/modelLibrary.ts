import * as THREE from "three";

export type ObjectStateKey =
  | "idle"
  | "bloom"
  | "wind"
  | "hover"
  | "custom"
  | (string & {});

export interface AnimationBinding {
  clip: string;
  loop?: THREE.AnimationActionLoopStyles;
  clampWhenFinished?: boolean;
  crossFadeSeconds?: number;
  nextState?: ObjectStateKey;
}

export interface ModelDefinition {
  key: string;
  url: string;
  defaultScale?: [number, number, number];
  defaultRotation?: [number, number, number];
  defaultState?: ObjectStateKey;
  animationMap: Record<ObjectStateKey, AnimationBinding>;
  metadataDefaults?: {
    title?: string | null;
    author?: string | null;
    message1?: string | null;
    message2?: string | null;
  };
}

export const modelLibrary: ModelDefinition[] = [
  {
    key: "flower_basic",
    url: import.meta.env.DEV ? "models/flower.glb" : "models/flower.glb",
    defaultScale: [1.4, 1.4, 1.4],
    defaultRotation: [0, Math.PI / 4, 0],
    defaultState: "idle",
    animationMap: {
      idle: {
        clip: "Idle",
        loop: THREE.LoopRepeat,
      },
      hover: {
        clip: "Hover",
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
        nextState: "idle",
      },
      wind: {
        clip: "Wind",
        loop: THREE.LoopRepeat,
        crossFadeSeconds: 0.25,
      },
      bloom: {
        clip: "Bloom",
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
        nextState: "idle",
      },
      custom: {
        clip: "Idle",
        loop: THREE.LoopRepeat,
      },
    },
    metadataDefaults: {
      title: "Prototype Flower",
      author: "System",
    },
  },
];

export function getModelDefinition(key?: string) {
  if (!key) return undefined;
  return modelLibrary.find((definition) => definition.key === key);
}
