import { useState, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export function useHoverInteraction() {
  const [hoveredObject, setHoveredObject] = useState<THREE.Object3D | null>(
    null
  );

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredObject(e.object);
  }, []);

  const onPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredObject(null);
  }, []);

  const getScale = useCallback(
    (object: THREE.Object3D): [number, number, number] => {
      return hoveredObject === object ? [1.2, 1.2, 1.2] : [1, 1, 1];
    },
    [hoveredObject]
  );

  return {
    hoveredObject,
    onPointerOver,
    onPointerOut,
    getScale,
  };
}

