import { useCallback, useEffect, useMemo, useState } from "react";
import type { ObjectStateKey } from "../objectSystem/modelLibrary";
import { getModelDefinition, modelLibrary } from "../objectSystem/modelLibrary";
import { useGLTF } from "@react-three/drei";
import { GRID_CONFIG } from "../config/grid";
import { MODEL_CONFIG } from "../config/models";

export type PlacementPolicy = "skip" | "replace";

export interface SceneObjectMetadata {
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
  createdAt?: number;
  createdBy?: string | null;
}

export interface SceneObjectInstance {
  id: string;
  modelKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  state: ObjectStateKey;
  restState: ObjectStateKey;
  metadata: SceneObjectMetadata;
  title?: string | null;
  author?: string | null;
  message1?: string | null;
  message2?: string | null;
}

interface PlaceObjectOptions {
  gridX: number;
  gridZ: number;
  height?: number;
  modelKey?: string;
  rotation?: [number, number, number];
  scale?: [number, number, number];
  state?: ObjectStateKey;
  metadata?: SceneObjectMetadata;
  policy?: PlacementPolicy;
}

interface SetStateOptions {
  setAsRestState?: boolean;
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `obj_${crypto.randomUUID()}`;
  }
  return `obj_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

export function usePlacedObjects(defaultModelKey?: string) {
  const [objects, setObjects] = useState<SceneObjectInstance[]>([]);

  const resolvedDefaultModelKey = useMemo(
    () => defaultModelKey || modelLibrary[0]?.key,
    [defaultModelKey],
  );

  // Preload all registered models up-front for quicker instancing
  useEffect(() => {
    modelLibrary.forEach((definition) => {
      useGLTF.preload(definition.url);
    });
  }, []);

  const findByCell = useCallback(
    (x: number, z: number) =>
      objects.find((obj) => obj.position[0] === x && obj.position[2] === z),
    [objects],
  );


  const placeObject = useCallback(
    ({
      gridX,
      gridZ,
      height = GRID_CONFIG.DEFAULT_OBJECT_Y,
      modelKey,
      rotation,
      scale,
      state,
      metadata,
      policy = "replace",
    }: PlaceObjectOptions) => {
      const definition = getModelDefinition(
        modelKey || resolvedDefaultModelKey,
      );
      if (!definition) {
        console.warn("No model definition registered", modelKey);
        return { placed: false, reason: "missing-model" as const };
      }

      const existing = findByCell(gridX, gridZ);
      if (existing && policy === "skip") {
        return { placed: false, reason: "occupied" as const, existing };
      }

      const id = generateId();
      const nextState = state || definition.defaultState || "idle";
      const baseMetadata = {
        createdAt: Date.now(),
        ...definition.metadataDefaults,
        ...metadata,
      };

      const newObject: SceneObjectInstance = {
        id: `temp_${Date.now()}`,
        modelKey: definition.key,
        position: [
          gridX + MODEL_CONFIG.DEFAULT_POSITION_OFFSET[0],
          height + MODEL_CONFIG.DEFAULT_POSITION_OFFSET[1],
          gridZ + MODEL_CONFIG.DEFAULT_POSITION_OFFSET[2],
        ],
        rotation: rotation || definition.defaultRotation || [0, 0, 0], // Assuming MODEL_CONFIG.DEFAULT_ROTATION is meant to replace this
        scale: scale || definition.defaultScale || [1, 1, 1], // Assuming MODEL_CONFIG.DEFAULT_SCALE is meant to replace this
        state: nextState, // Assuming "created" is meant to replace this
        restState: nextState,
        metadata: baseMetadata,
        title: baseMetadata.title ?? null,
        author: baseMetadata.author ?? null,
        message1: baseMetadata.message1 ?? null,
        message2: baseMetadata.message2 ?? null,
      };

      setObjects((prev) => {
        const filtered =
          policy === "replace" && existing
            ? prev.filter((obj) => obj.id !== existing.id)
            : prev;
        return [...filtered, newObject];
      });

      return { placed: true, id };
    },
    [findByCell, resolvedDefaultModelKey],
  );

  const setObjectState = useCallback(
    (
      objectId: string,
      nextState: ObjectStateKey,
      options?: SetStateOptions,
    ) => {
      setObjects((prev) =>
        prev.map((obj) =>
          obj.id === objectId
            ? {
                ...obj,
                state: nextState,
                restState: options?.setAsRestState ? nextState : obj.restState,
              }
            : obj,
        ),
      );
    },
    [],
  );

  const restoreRestState = useCallback((objectId: string) => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === objectId ? { ...obj, state: obj.restState } : obj,
      ),
    );
  }, []);

  const setAllObjectsState = useCallback(
    (nextState: ObjectStateKey, options?: SetStateOptions) => {
      setObjects((prev) =>
        prev.map((obj) => ({
          ...obj,
          state: nextState,
          restState: options?.setAsRestState ? nextState : obj.restState,
        })),
      );
    },
    [],
  );

  const deleteObject = useCallback((objectId: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== objectId));
  }, []);

  const updateObject = useCallback(
    (
      objectId: string,
      updates: {
        title?: string | null;
        author?: string | null;
        message1?: string | null;
        message2?: string | null;
      },
    ) => {
      setObjects((prev) =>
        prev.map((obj) =>
          obj.id === objectId
            ? {
                ...obj,
                title: updates.title ?? obj.title,
                author: updates.author ?? obj.author,
                message1: updates.message1 ?? obj.message1,
                message2: updates.message2 ?? obj.message2,
                metadata: {
                  ...obj.metadata,
                  title: updates.title ?? obj.metadata?.title,
                  author: updates.author ?? obj.metadata?.author,
                  message1: updates.message1 ?? obj.metadata?.message1,
                  message2: updates.message2 ?? obj.metadata?.message2,
                },
              }
            : obj,
        ),
      );
    },
    [],
  );

  type ExternalObject = {
    id: string;
    position: [number, number, number];
    title?: string | null;
    author?: string | null;
    message1?: string | null;
    message2?: string | null;
    modelKey?: string;
  };

  // Synchronize render objects from an external source (e.g., Supabase rows)
  const syncFromExternal = useCallback(
    (entries: ExternalObject[]) => {
      const defaultDef = getModelDefinition(resolvedDefaultModelKey);
      if (!defaultDef) return;

      setObjects((prev) => {
        const prevMap = new Map(prev.map((o) => [o.id, o]));

        return entries.map((entry) => {
          const existing = prevMap.get(entry.id);
          const modelKey = entry.modelKey || defaultDef.key;
          const defForEntry = getModelDefinition(modelKey) || defaultDef;
          const preservedState = existing?.state ?? defForEntry.defaultState ?? "idle";
          const baseMetadata = {
            ...defForEntry.metadataDefaults,
            ...existing?.metadata,
            title: entry.title ?? existing?.metadata?.title,
            author: entry.author ?? existing?.metadata?.author,
            message1: entry.message1 ?? existing?.metadata?.message1,
            message2: entry.message2 ?? existing?.metadata?.message2,
          };

          return {
            id: entry.id,
            modelKey,
            position: [
              entry.position[0] + MODEL_CONFIG.DEFAULT_POSITION_OFFSET[0],
              entry.position[1] + MODEL_CONFIG.DEFAULT_POSITION_OFFSET[1],
              entry.position[2] + MODEL_CONFIG.DEFAULT_POSITION_OFFSET[2],
            ],
            rotation: existing?.rotation || defForEntry.defaultRotation || [0, 0, 0],
            scale: existing?.scale || defForEntry.defaultScale || [1, 1, 1],
            state: preservedState,
            restState: existing?.restState ?? preservedState,
            metadata: baseMetadata,
            title: baseMetadata.title ?? null,
            author: baseMetadata.author ?? null,
            message1: baseMetadata.message1 ?? null,
            message2: baseMetadata.message2 ?? null,
          } as SceneObjectInstance;
        });
      });
    },
    [resolvedDefaultModelKey],
  );

  return {
    objects,
    placeObject,
    setObjectState,
    restoreRestState,
    setAllObjectsState,
    deleteObject,
    updateObject,
    syncFromExternal,
  };
}
