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
  nodeName?: string; // For single GLB with multiple nodes (deprecated)
  meshIndex?: number; // Index of the mesh to render from the GLB file
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

const COMMON_ANIMATION_MAP: Record<ObjectStateKey, AnimationBinding> = {
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
    clip: "Hover",
    loop: THREE.LoopOnce,
    clampWhenFinished: true,
  },
};

export const modelLibrary: ModelDefinition[] = MODEL_CONFIG.BUILDING_TYPES.map(
  (type) => ({
    key: type.key,
    url:
      MODEL_CONFIG.LOAD_STRATEGY === "single_glb"
        ? MODEL_CONFIG.SHARED_GLB_URL
        : `${MODEL_CONFIG.BASE_URL}${type.key}.glb`,
    meshIndex: type.meshIndex,
    defaultScale: MODEL_CONFIG.DEFAULT_SCALE,
    defaultRotation: MODEL_CONFIG.DEFAULT_ROTATION,
    defaultState: "created",
    animationMap: COMMON_ANIMATION_MAP,
    metadataDefaults: {
      title: type.name,
      author: "System",
    },
  }),
);


export function getModelDefinition(key?: string) {
  if (!key) return undefined;
  return modelLibrary.find((definition) => definition.key === key);
}
