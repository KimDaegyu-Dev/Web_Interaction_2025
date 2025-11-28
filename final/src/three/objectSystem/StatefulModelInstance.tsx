import { useEffect, useMemo, useRef, memo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type {
  AnimationBinding,
  ModelDefinition,
  ObjectStateKey,
} from "./modelLibrary";
import { modelCache } from "./ModelCache";
import type { SceneObjectInstance } from "../hooks/usePlacedObjects";
import { MODEL_CONFIG } from "../config/models";
import { GRID_CONFIG } from "../config/grid";
import type { CursorData } from "@/utils/supabase";

interface StatefulModelInstanceProps {
  instance: SceneObjectInstance;
  definition: ModelDefinition;
  onRequestStateChange?: (id: string, nextState: ObjectStateKey) => void;
  onClick?: (e: ThreeEvent<MouseEvent>, id: string) => void;
  cursors?: CursorData[];
  myCursor?: {
    gridX: number;
    gridZ: number;
  } | null;
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

export const StatefulModelInstance = memo(function StatefulModelInstance({
  instance,
  definition,
  onRequestStateChange,
  onClick,
  cursors = [],
  myCursor = null,
}: StatefulModelInstanceProps) {
  const gltf = useGLTF(definition.url);
  
  const clonedScene = useMemo(() => {
    // Construct a unique cache key
    const cacheKey = definition.meshIndex !== undefined 
      ? `${definition.url}_mesh_${definition.meshIndex}`
      : definition.nodeName 
        ? `${definition.url}_node_${definition.nodeName}`
        : definition.url;

    return modelCache.cloneFromCache(cacheKey, () => {
      // Factory function: creates the base object to be cached
      
      // If meshIndex is specified, extract that specific mesh
      if (definition.meshIndex !== undefined) {
        const meshes: THREE.Mesh[] = [];
        
        // Traverse the scene to collect all meshes
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshes.push(child);
          }
        });

        // Get the mesh at the specified index
        if (meshes[definition.meshIndex]) {
          const targetMesh = meshes[definition.meshIndex];
          // We clone here to create the prototype for the cache
          const clonedMesh = clone(targetMesh) as THREE.Mesh;
          
          // Reset position/rotation/scale of the mesh itself
          clonedMesh.position.set(0, 0, 0);
          clonedMesh.rotation.set(0, 0, 0);
          clonedMesh.scale.set(1, 1, 1);
          
          const group = new THREE.Group();
          group.add(clonedMesh);
          return group;
        } else {
          console.warn(
            `Mesh index ${definition.meshIndex} not found in ${definition.url}. Total meshes: ${meshes.length}`,
          );
          // Fallback to empty group to prevent errors
          return new THREE.Group();
        }
      }
      
      // Fallback: use nodeName if specified (deprecated)
      if (definition.nodeName) {
        const node = gltf.scene.getObjectByName(definition.nodeName);
        if (node) {
          const clonedNode = clone(node) as THREE.Object3D;
          clonedNode.position.set(0, 0, 0);
          clonedNode.rotation.set(0, 0, 0);
          clonedNode.scale.set(1, 1, 1);
          const group = new THREE.Group();
          group.add(clonedNode);
          return group;
        } else {
          console.warn(
            `Node ${definition.nodeName} not found in ${definition.url}`,
          );
        }
      }
      
      // Default: clone the entire scene
      return clone(gltf.scene);
    });
  }, [gltf.scene, definition.meshIndex, definition.nodeName, definition.url]);

  const groupRef = useRef<THREE.Group>(null);

  const displayScale = useMemo<[number, number, number]>(() => {
    const [sx, sy, sz] = instance.scale.map(
      (s) => s * MODEL_CONFIG.SCALE_MULTIPLIER,
    );
    // 호버 스케일 제거
    return [sx, sy, sz];
  }, [instance.scale]);

  const { actions, mixer } = useAnimations(gltf.animations, clonedScene);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const currentStateRef = useRef<ObjectStateKey>(instance.state);

  // Calculate if building should be visible based on cursor distance
  const shouldRender = useMemo(() => {
    // Combine all cursor positions
    const allCursorPositions: { x: number; z: number }[] = [];
    
    // Add other users' cursors
    cursors.forEach(cursor => {
      allCursorPositions.push({ x: cursor.grid_x, z: cursor.grid_z });
    });
    
    // Add my cursor
    if (myCursor) {
      allCursorPositions.push({ x: myCursor.gridX, z: myCursor.gridZ });
    }

    // If no cursors, don't render
    if (allCursorPositions.length === 0) {
      return false;
    }

    // Calculate minimum distance to any cursor
    const buildingX = instance.position[0];
    const buildingZ = instance.position[2];
    const influenceRadius = GRID_CONFIG.CURSOR_INFLUENCE_RADIUS;

    for (const cursor of allCursorPositions) {
      const dx = buildingX - cursor.x;
      const dz = buildingZ - cursor.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // If within range of any cursor, render
      if (distance <= influenceRadius - 6) {
        return true;
      }
    }

    return false;
  }, [cursors, myCursor, instance.position]);

  useEffect(() => {
    if (!actions) return;

    const { binding, action } = resolveAnimationBinding(
      instance.state,
      definition.animationMap,
      actions,
    );

    if (!binding || !action) return;

    const previousAction = activeActionRef.current;
    const crossFade =
      binding.crossFadeSeconds ?? MODEL_CONFIG.ANIMATION.DEFAULT_CROSS_FADE;

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
  }, [
    actions,
    definition.animationMap,
    instance.id,
    instance.state,
    onRequestStateChange,
  ]);

  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  // Don't render if outside cursor influence range
  if (!shouldRender) {
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={instance.position}
      rotation={instance.rotation}
      scale={displayScale}
      onClick={(e) => onClick?.(e, instance.id)}
      userData={{ objectId: instance.id, modelKey: instance.modelKey }}
    >
      <primitive object={clonedScene} />
    </group>
  );
});
