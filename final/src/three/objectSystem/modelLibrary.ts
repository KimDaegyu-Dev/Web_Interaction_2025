import * as THREE from "three";
import { MODEL_CONFIG } from "../config/models";

export type ObjectStateKey =
  | "idle"
  | "created"
  | "deleted"
  | "clicked"
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
    key: "building_basic",
    url: import.meta.env.DEV ? "models/building.glb" : "models/building.glb",
    defaultScale: MODEL_CONFIG.DEFAULT_SCALE,
    defaultRotation: MODEL_CONFIG.DEFAULT_ROTATION,
    defaultState: "created",
    animationMap: {
      idle: {
        clip: "Idle",
        loop: THREE.LoopRepeat,
      },
      created: {
        clip: "Bloom",
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
        nextState: "idle",
      },
      clicked: {
        clip: "Wind",
        loop: THREE.LoopOnce,
        nextState: "idle",
      },
      deleted: {
        clip: "Hover", // Placeholder for now
        loop: THREE.LoopOnce,
        clampWhenFinished: true,
      },
    },
    metadataDefaults: {
      title: "New Building",
      author: "System",
    },
  },
];

export function getModelDefinition(key?: string) {
  if (!key) return undefined;
  return modelLibrary.find((definition) => definition.key === key);
}
