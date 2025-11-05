import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ProjectionParams } from '../config/types';
import { calculateObliqueMatrix, applyObliqueProjection } from '../utils/projection';

export function useObliqueProjection(
  groupRef: React.RefObject<THREE.Group>,
  params: ProjectionParams
) {
  const panOffsetRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (groupRef.current) {
      const matrix = calculateObliqueMatrix(params, panOffsetRef.current);
      applyObliqueProjection(groupRef.current, matrix);
    }
  });

  return {
    panOffset: panOffsetRef,
  };
}

