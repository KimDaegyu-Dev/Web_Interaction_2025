import { useCallback, useEffect, useState } from "react";

export type LSystemRuleMap = Record<string, string>;
export type FlowerType =
  | "tulip"
  | "sunflower"
  | "wild"
  | "cherry"
  | "abstract";

export interface LSystemPlant {
  id: string;
  position: { x: number; y: number; z: number };
  iteration: number;
  currentString: string;
  prevString: string;
  maxIterations: number;
  nextGrowthAt: number;
  isComplete: boolean;
  growthDelay: number;
  rules: LSystemRuleMap;
  flowerType: FlowerType;
}

const FLOWER_PRESETS: Record<
  FlowerType,
  { axiom: string; rules: LSystemRuleMap; maxIterations: number; growthDelay: number }
> = {
  tulip: {
    axiom: "F",
    rules: {
      F: "F[+B][-B]",
      B: "FF",
    },
    maxIterations: 3,
    growthDelay: 1100,
  },
  sunflower: {
    axiom: "X",
    rules: {
      X: "F[+X][-X]FX",
      F: "FF",
    },
    maxIterations: 3,
    growthDelay: 1200,
  },
  wild: {
    axiom: "F",
    rules: {
      F: "F[+F][-F]F",
    },
    maxIterations: 3,
    growthDelay: 1000,
  },
  cherry: {
    axiom: "A",
    rules: {
      A: "F[+A][-A]",
      F: "FF",
    },
    maxIterations: 3,
    growthDelay: 1100,
  },
  abstract: {
    axiom: "X",
    rules: {
      X: "+F-XF+F-X",
      F: "FF",
    },
    maxIterations: 4,
    growthDelay: 900,
  },
};

const DEFAULT_GROWTH_DELAY = 1200; // ms between iteration steps
const DEFAULT_MAX_ITERATIONS = 3;

function applyRules(sequence: string, rules: LSystemRuleMap) {
  let result = "";
  for (const char of sequence) {
    result += rules[char] ?? char;
  }
  return result;
}

export function useLSystemPlants({
  defaultFlowerType = "wild",
  defaultGrowthDelay = DEFAULT_GROWTH_DELAY,
  defaultMaxIterations = DEFAULT_MAX_ITERATIONS,
}: {
  defaultFlowerType?: FlowerType;
  defaultGrowthDelay?: number;
  defaultMaxIterations?: number;
} = {}) {
  const [plants, setPlants] = useState<LSystemPlant[]>([]);

  const createSeed = useCallback(
    (x: number, y: number, z: number, flowerType?: FlowerType) => {
      setPlants((prev) => {
        // 동일 좌표에 이미 씨앗이 있으면 새로 추가하지 않음
        const exists = prev.some(
          (plant) => plant.position.x === x && plant.position.z === z,
        );
        if (exists) return prev;

        const now = performance.now();
        const chosenType = flowerType ?? defaultFlowerType;
        const preset =
          FLOWER_PRESETS[chosenType] ??
          FLOWER_PRESETS[defaultFlowerType] ??
          FLOWER_PRESETS.wild;
        const growthDelay = preset.growthDelay ?? defaultGrowthDelay;
        const maxIterations = preset.maxIterations ?? defaultMaxIterations;

        const newPlant: LSystemPlant = {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          position: { x, y, z },
          iteration: 0,
          currentString: preset.axiom,
          prevString: preset.axiom,
          maxIterations,
          nextGrowthAt: now + growthDelay,
          isComplete: maxIterations === 0,
          growthDelay,
          rules: preset.rules,
          flowerType: chosenType,
        };

        return [...prev, newPlant];
      });
    },
    [defaultFlowerType, defaultGrowthDelay, defaultMaxIterations],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      setPlants((prev) => {
        let changed = false;

        const next = prev.map<LSystemPlant>((plant) => {
          if (plant.isComplete || now < plant.nextGrowthAt) {
            return plant;
          }

          changed = true;
          const nextIteration = plant.iteration + 1;
          const nextString = applyRules(plant.currentString, plant.rules);
          const reachedEnd = nextIteration >= plant.maxIterations;

          return {
            ...plant,
            iteration: nextIteration,
            prevString: plant.currentString,
            currentString: nextString,
            isComplete: reachedEnd,
            nextGrowthAt: now + plant.growthDelay,
          };
        });

        return changed ? next : prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return {
    plants,
    createSeed,
  };
}

export { FLOWER_PRESETS };
