import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { FlowerType, LSystemPlant } from "../hooks/useLSystemPlants";

interface Segment {
  start: THREE.Vector3;
  end: THREE.Vector3;
}

interface Structure {
  segments: Segment[];
  leaves: THREE.Vector3[];
  buds: THREE.Vector3[];
}

interface FlowerStyle {
  stepBase: number;
  stepGain: number;
  angleDeg: number;
  lean: number;
  randomness: number;
  budSymbols: Set<string>;
  leafChance: number;
  twist?: number;
  timeline?: { bud: number; bloom: number };
  petals: {
    min: number;
    max: number;
    color: string;
    emissive?: string;
    budColor: string;
    centerColor: string;
    petalTilt?: number;
    petalThickness?: number;
    radialBoost?: number;
    spiral?: boolean;
  };
  leafColor: string;
  leafAccent: string;
}

const FLOWER_STYLES: Record<FlowerType, FlowerStyle> = {
  tulip: {
    stepBase: 0.3,
    stepGain: 0.07,
    angleDeg: 12,
    lean: 0.05,
    randomness: 0.08,
    budSymbols: new Set(["B", "X"]),
    leafChance: 0.5,
    petals: {
      min: 3,
      max: 4,
      color: "#f070a1",
      emissive: "#5c2a4d",
      budColor: "#6ca86b",
      centerColor: "#ffd6a5",
      petalTilt: -0.25,
      petalThickness: 0.35,
      radialBoost: 0.4,
    },
    leafColor: "#6fab6b",
    leafAccent: "#8dca8e",
    timeline: { bud: 0.35, bloom: 0.65 },
  },
  sunflower: {
    stepBase: 0.25,
    stepGain: 0.05,
    angleDeg: 25,
    lean: 0.08,
    randomness: 0.05,
    budSymbols: new Set(["X"]),
    leafChance: 0.65,
    petals: {
      min: 20,
      max: 28,
      color: "#fbc02d",
      emissive: "#ae7d1d",
      budColor: "#76965b",
      centerColor: "#5a3b1a",
      petalTilt: 0.1,
      petalThickness: 0.5,
      radialBoost: 0.8,
    },
    leafColor: "#5b8a43",
    leafAccent: "#83af6c",
    timeline: { bud: 0.25, bloom: 0.6 },
  },
  wild: {
    stepBase: 0.24,
    stepGain: 0.06,
    angleDeg: 28,
    lean: 0.12,
    randomness: 0.3,
    budSymbols: new Set(["X", "B"]),
    leafChance: 0.75,
    petals: {
      min: 3,
      max: 5,
      color: "#c489f0",
      emissive: "#613781",
      budColor: "#78bd78",
      centerColor: "#ffe28a",
      petalThickness: 0.2,
    },
    leafColor: "#79b474",
    leafAccent: "#9dd59a",
    timeline: { bud: 0.35, bloom: 0.65 },
  },
  cherry: {
    stepBase: 0.22,
    stepGain: 0.05,
    angleDeg: 16,
    lean: 0.1,
    randomness: 0.12,
    budSymbols: new Set(["X"]),
    leafChance: 0.45,
    petals: {
      min: 5,
      max: 5,
      color: "#f6b4d6",
      emissive: "#c7779e",
      budColor: "#f3a7d0",
      centerColor: "#ffe7a2",
      petalTilt: 0.05,
      petalThickness: 0.18,
      radialBoost: 0.3,
    },
    leafColor: "#7fbf86",
    leafAccent: "#a3ddb0",
    timeline: { bud: 0.3, bloom: 0.6 },
  },
  abstract: {
    stepBase: 0.18,
    stepGain: 0.04,
    angleDeg: 42,
    lean: 0.06,
    randomness: 0.25,
    budSymbols: new Set(["X"]),
    leafChance: 0.2,
    twist: 0.3,
    petals: {
      min: 8,
      max: 12,
      color: "#6bd2e5",
      emissive: "#2d6572",
      budColor: "#7dc8b5",
      centerColor: "#f9ffb3",
      petalTilt: -0.15,
      petalThickness: 0.45,
      spiral: true,
    },
    leafColor: "#6aa8a2",
    leafAccent: "#9ad7ce",
    timeline: { bud: 0.2, bloom: 0.55 },
  },
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function smoothstep(t: number) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function pseudoRandom(seed: number) {
  return (Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildStructure(
  sequence: string,
  iteration: number,
  style: FlowerStyle,
): Structure {
  const position = new THREE.Vector3(0, 0, 0);
  const heading = new THREE.Vector3(0, 1, 0);
  const stack: { position: THREE.Vector3; heading: THREE.Vector3 }[] = [];

  const stepLength = style.stepBase + iteration * style.stepGain;
  const angle = THREE.MathUtils.degToRad(style.angleDeg);

  const segments: Segment[] = [];
  const leaves: THREE.Vector3[] = [];
  const buds: THREE.Vector3[] = [];

  for (let i = 0; i < sequence.length; i++) {
    const char = sequence[i]!;

    if (char === "F") {
      const yaw = (pseudoRandom(i + 1) - 0.5) * style.randomness;
      const pitch = style.lean;
      heading.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      heading.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
      if (style.twist) {
        heading.applyAxisAngle(new THREE.Vector3(0, 0, 1), style.twist);
      }

      const next = position.clone().addScaledVector(heading, stepLength);
      segments.push({ start: position.clone(), end: next.clone() });

      if (pseudoRandom(i * 1.7) < style.leafChance) {
        leaves.push(next.clone());
      }

      position.copy(next);
    } else if (style.budSymbols.has(char)) {
      buds.push(position.clone());
    } else if (char === "+") {
      const sway = pseudoRandom(i) * style.randomness;
      heading.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle + sway);
    } else if (char === "-") {
      const sway = pseudoRandom(i + 2) * style.randomness;
      heading.applyAxisAngle(new THREE.Vector3(0, 0, 1), -angle - sway);
    } else if (char === "[") {
      stack.push({ position: position.clone(), heading: heading.clone() });
    } else if (char === "]") {
      const last = stack.pop();
      if (last) {
        position.copy(last.position);
        heading.copy(last.heading);
      }
    }
  }

  return { segments, leaves, buds };
}

function lerpVector(a: THREE.Vector3, b: THREE.Vector3, t: number) {
  return a.clone().lerp(b, t);
}

function interpolateSegments(
  prev: Segment[],
  next: Segment[],
  morphT: number,
  growT: number,
): Segment[] {
  const count = Math.max(prev.length, next.length);
  const lastPrev = prev[prev.length - 1] ?? {
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
  };

  return Array.from({ length: count }, (_, i) => {
    const p = prev[i] ?? lastPrev;
    const n = next[i] ?? next[next.length - 1] ?? p;
    const start = lerpVector(p.start, n.start, morphT);
    const endTarget = lerpVector(p.end, n.end, morphT);
    const end = start.clone().lerp(endTarget, growT);
    return { start, end };
  });
}

function interpolatePoints(
  prev: THREE.Vector3[],
  next: THREE.Vector3[],
  morphT: number,
): THREE.Vector3[] {
  const count = Math.max(prev.length, next.length);
  const fallback = prev[prev.length - 1] ?? next[next.length - 1] ?? new THREE.Vector3();
  return Array.from({ length: count }, (_, i) => {
    const p = prev[i] ?? fallback;
    const n = next[i] ?? fallback;
    return lerpVector(p, n, morphT);
  });
}

function BranchSegment({
  segment,
  opacity,
}: {
  segment: Segment;
  opacity: number;
}) {
  const positions = useMemo(
    () =>
      new Float32Array([
        segment.start.x,
        segment.start.y,
        segment.start.z,
        segment.end.x,
        segment.end.y,
        segment.end.z,
      ]),
    [
      segment.end.x,
      segment.end.y,
      segment.end.z,
      segment.start.x,
      segment.start.y,
      segment.start.z,
    ],
  );

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          count={2}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#395034"
        transparent
        opacity={opacity}
        linewidth={1}
      />
    </line>
  );
}

interface FlowerProps {
  position: THREE.Vector3;
  bloom: number;
  seed: number;
  style: FlowerStyle;
}

function Flower({ position, bloom, seed, style }: FlowerProps) {
  const petalCount =
    style.petals.min +
    Math.floor((style.petals.max - style.petals.min) * pseudoRandom(seed + 11));
  const petals = useMemo(
    () =>
      Array.from({ length: petalCount }).map((_, idx) => {
        const baseAngle = (idx / petalCount) * Math.PI * 2;
        const wobble = (pseudoRandom(seed + idx) - 0.5) * 0.2;
        const spiralOffset = style.petals.spiral
          ? idx * 0.08
          : 0;
        return baseAngle + wobble + spiralOffset;
      }),
    [petalCount, seed, style.petals.spiral],
  );

  const petalOpen = THREE.MathUtils.clamp(bloom, 0, 1);
  const tilt = style.petals.petalTilt ?? 0;
  const petalThickness = style.petals.petalThickness ?? 0.3;
  const radialBoost = style.petals.radialBoost ?? 0.3;

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* 봉오리 */}
      <mesh
        scale={[
          0.14 + petalOpen * 0.05,
          0.18 + petalOpen * 0.05,
          0.14 + petalOpen * 0.05,
        ]}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial
          color={style.petals.budColor}
          transparent
          opacity={0.9 - petalOpen * 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 꽃잎 */}
      {petals.map((angle, idx) => (
        <mesh
          key={idx}
          rotation={[Math.PI / 2 + tilt, 0, angle]}
          position={[
            Math.cos(angle) * petalOpen * (0.06 + radialBoost * 0.04),
            0.02 + petalOpen * 0.05,
            Math.sin(angle) * petalOpen * (0.06 + radialBoost * 0.04),
          ]}
          scale={[
            0.12 + petalOpen * (0.14 + radialBoost * 0.08),
            (0.08 + petalOpen * 0.1) * petalThickness,
            0.12 + petalOpen * (0.16 + radialBoost * 0.05),
          ]}
        >
          <sphereGeometry args={[1, 14, 14]} />
          <meshStandardMaterial
            color={style.petals.color}
            emissive={style.petals.emissive ?? "#4a2f47"}
            emissiveIntensity={0.18}
            transparent
            opacity={0.7 + petalOpen * 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 꽃 중앙 */}
      <mesh position={[0, 0.085, 0]} scale={0.12 + petalOpen * 0.08}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color={style.petals.centerColor}
          emissive="#c97a1d"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Leaf({
  position,
  openness,
  style,
}: {
  position: THREE.Vector3;
  openness: number;
  style: FlowerStyle;
}) {
  const scale = 0.18 + openness * 0.08;
  return (
    <group
      position={[position.x, position.y, position.z]}
      scale={scale}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <mesh>
        <coneGeometry args={[0.13, 0.2, 7]} />
        <meshStandardMaterial
          color={style.leafColor}
          transparent
          opacity={Math.min(1, openness)}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={style.leafAccent}
          transparent
          opacity={Math.min(1, openness)}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function LSystemPlantObject({ plant }: { plant: LSystemPlant }) {
  const style = FLOWER_STYLES[plant.flowerType] ?? FLOWER_STYLES.wild;

  const [structure, setStructure] = useState<Structure>(() =>
    buildStructure(plant.currentString, plant.iteration, style),
  );

  const prevStructureRef = useRef<Structure>(structure);

  useEffect(() => {
    const nextStructure = buildStructure(
      plant.currentString,
      plant.iteration,
      style,
    );
    setStructure((prev) => {
      prevStructureRef.current = prev;
      return nextStructure;
    });
  }, [plant.currentString, plant.iteration, style]);

  const [phaseProgress, setPhaseProgress] = useState(0);
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      const now = performance.now();
      const start = plant.nextGrowthAt - plant.growthDelay;
      const raw = THREE.MathUtils.clamp(
        (now - start) / plant.growthDelay,
        0,
        1,
      );
      const t = plant.isComplete ? raw : raw;
      setPhaseProgress(easeOutCubic(t));
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [plant.growthDelay, plant.id, plant.isComplete, plant.nextGrowthAt]);

  const budPhaseStart = style.timeline?.bud ?? 0.3;
  const bloomPhaseStart = style.timeline?.bloom ?? 0.6;
  const budT = smoothstep(
    (phaseProgress - budPhaseStart) / Math.max(0.0001, bloomPhaseStart - budPhaseStart),
  );
  const bloomT = smoothstep(
    (phaseProgress - bloomPhaseStart) / Math.max(0.0001, 1 - bloomPhaseStart),
  );
  const stalkGrowT = smoothstep(phaseProgress);

  const blendedSegments = useMemo(
    () =>
      interpolateSegments(
        prevStructureRef.current.segments,
        structure.segments,
        phaseProgress,
        stalkGrowT,
      ),
    [phaseProgress, stalkGrowT, structure.segments],
  );

  const blendedLeaves = useMemo(
    () =>
      interpolatePoints(
        prevStructureRef.current.leaves,
        structure.leaves,
        phaseProgress,
      ),
    [phaseProgress, structure.leaves],
  );

  const blendedBuds = useMemo(
    () =>
      interpolatePoints(
        prevStructureRef.current.buds,
        structure.buds,
        phaseProgress,
      ),
    [phaseProgress, structure.buds],
  );

  const normalizedIteration =
    plant.maxIterations === 0 ? 1 : plant.iteration / plant.maxIterations;
  const seedScale = 0.6 + normalizedIteration * 0.4 + phaseProgress * 0.2;

  const leafVisibleCount = Math.max(
    1,
    Math.ceil(blendedLeaves.length * Math.max(budT, 0.05)),
  );

  const seedForFlower = useMemo(() => hashString(plant.id), [plant.id]);

  return (
    <group position={[plant.position.x, plant.position.y, plant.position.z]}>
      {/* 씨앗/기저부 */}
      <mesh position={[0, -0.08, 0]} scale={seedScale}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#3e6b41" side={THREE.DoubleSide} />
      </mesh>

      {blendedSegments.map((segment, idx) => (
        <BranchSegment
          key={`${plant.id}-seg-${idx}`}
          segment={segment}
          opacity={Math.min(1, 0.4 + stalkGrowT * 0.7)}
        />
      ))}

      {blendedLeaves.slice(0, leafVisibleCount).map((leaf, idx) => (
        <Leaf
          key={`${plant.id}-leaf-${idx}`}
          position={leaf}
          openness={budT}
          style={style}
        />
      ))}

      {/* 꽃 */}
      {blendedBuds.map((bud, idx) => (
        <Flower
          key={`${plant.id}-flower-${idx}`}
          position={bud}
          bloom={bloomT}
          seed={seedForFlower + idx * 17}
          style={style}
        />
      ))}
    </group>
  );
}
