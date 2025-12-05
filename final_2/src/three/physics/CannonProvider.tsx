import { ReactNode } from "react";
import { Physics } from "@react-three/cannon";
import { PHYSICS_CONFIG } from "../config/constants";

interface CannonProviderProps {
  children: ReactNode;
  gravity?: [number, number, number];
  isPaused?: boolean;
}

/**
 * Cannon.js 물리 엔진 래퍼
 * @react-three/cannon을 사용하여 R3F와 통합
 */
export function CannonProvider({
  children,
  gravity = PHYSICS_CONFIG.GRAVITY,
  isPaused = false,
}: CannonProviderProps) {
  return (
    <Physics
      gravity={gravity}
      isPaused={isPaused}
      allowSleep
      defaultContactMaterial={{
        friction: 0.5,
        restitution: 0.2,
      }}
    >
      {children}
    </Physics>
  );
}
