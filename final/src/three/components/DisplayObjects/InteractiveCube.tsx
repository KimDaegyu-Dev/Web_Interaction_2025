import { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface InteractiveCubeProps {
  position?: [number, number, number];
  color?: number;
  emissive?: number;
  rotationSpeed?: [number, number];
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
  hovered?: boolean;
}

export function InteractiveCube({
  position = [0, 0, 0],
  color = 0x6c5ce7,
  emissive = 0x4a3f8f,
  rotationSpeed = [0.01, 0.01],
  onPointerOver,
  onPointerOut,
  hovered = false,
}: InteractiveCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 호버 애니메이션
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 300, friction: 20 },
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0];
      meshRef.current.rotation.y += rotationSpeed[1];
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
        emissive={emissive}
        emissiveIntensity={0.2}
      />
    </animated.mesh>
  );
}

