import { useEffect, useMemo, useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type {
  AnimationBinding,
  ModelDefinition,
  ObjectStateKey,
} from "./modelLibrary";
import type { SceneObjectInstance } from "../hooks/usePlacedObjects";

interface StatefulModelInstanceProps {
  instance: SceneObjectInstance;
  definition: ModelDefinition;
  onRequestStateChange?: (id: string, nextState: ObjectStateKey) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>, id: string) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>, id: string) => void;
  onClick?: (e: ThreeEvent<MouseEvent>, id: string) => void;
  hovered?: boolean;
}

function resolveAnimationBinding(
  requested: ObjectStateKey,
  mapping: ModelDefinition["animationMap"],
  actions: Record<string, THREE.AnimationAction> | undefined,
): { binding: AnimationBinding | null; action: THREE.AnimationAction | null } {
  const fallback = mapping.idle;
  const binding = mapping[requested] || fallback;
  if (!binding || !actions) {
    return { binding: null, action: null };
  }

  const action =
    actions[binding.clip] || (fallback ? actions[fallback.clip] : null) || null;

  return { binding, action };
}

export function StatefulModelInstance({
  instance,
  definition,
  onRequestStateChange,
  onPointerOver,
  onPointerOut,
  onClick,
  hovered = false,
}: StatefulModelInstanceProps) {
  const gltf = useGLTF(definition.url);
  const clonedScene = useMemo(
    () => clone(gltf.scene),
    [gltf.scene],
  );
  const groupRef = useRef<THREE.Group>(null);

  const displayScale = useMemo<[number, number, number]>(() => {
    const [sx, sy, sz] = instance.scale;
    const factor = hovered ? 1.05 : 1;
    return [sx * factor, sy * factor, sz * factor];
  }, [hovered, instance.scale]);

  const { actions, mixer } = useAnimations(gltf.animations, clonedScene);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const currentStateRef = useRef<ObjectStateKey>(instance.state);

  useEffect(() => {
    if (!actions) return;

    const { binding, action } = resolveAnimationBinding(
      instance.state,
      definition.animationMap,
      actions,
    );

    if (!binding || !action) return;

    const previousAction = activeActionRef.current;
    const crossFade = binding.crossFadeSeconds ?? 0.3;

    action.reset();
    action.enabled = true;
    action.clampWhenFinished = binding.clampWhenFinished ?? false;
    action.setLoop(binding.loop ?? THREE.LoopRepeat, Infinity);
    action.play();

    if (previousAction && previousAction !== action) {
      previousAction.crossFadeTo(action, crossFade, false);
    }

    activeActionRef.current = action;
    currentStateRef.current = instance.state;

    const handleFinished = () => {
      if (binding.nextState) {
        onRequestStateChange?.(instance.id, binding.nextState);
      }
    };

    action.getMixer().addEventListener("finished", handleFinished);

    return () => {
      action.getMixer().removeEventListener("finished", handleFinished);
    };
  }, [actions, definition.animationMap, instance.id, instance.state, onRequestStateChange]);

  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return (
    <group
      ref={groupRef}
      position={instance.position}
      rotation={instance.rotation}
      scale={displayScale}
      onPointerOver={(e) => onPointerOver?.(e, instance.id)}
      onPointerOut={(e) => onPointerOut?.(e, instance.id)}
      onClick={(e) => onClick?.(e, instance.id)}
      userData={{ objectId: instance.id, modelKey: instance.modelKey }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
