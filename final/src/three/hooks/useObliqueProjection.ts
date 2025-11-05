import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ProjectionParams } from "../config/types";
import {
  calculateObliqueMatrix,
  applyObliqueProjection,
} from "../utils/projection";

export function useObliqueProjection(
  groupRef: React.RefObject<THREE.Group>,
  params: ProjectionParams,
  getPanOffset?: () => THREE.Vector3,
) {
  useFrame(() => {
    if (groupRef.current) {
      const panOffset = getPanOffset
        ? getPanOffset()
        : new THREE.Vector3(0, 0, 0);
      const matrix = calculateObliqueMatrix(params, panOffset);
      applyObliqueProjection(groupRef.current, matrix);
    }
  });
}
