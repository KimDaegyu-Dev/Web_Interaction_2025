import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CubeProps {
  position?: [number, number, number];
  color?: number;
  emissive?: number;
  rotationSpeed?: [number, number];
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: (e: THREE.Event) => void;
}

export function Cube({
  position = [0, 0, 0],
  color = 0x6c5ce7,
  emissive = 0x4a3f8f,
  rotationSpeed = [0.01, 0.01],
}: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0];
      meshRef.current.rotation.y += rotationSpeed[1];
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
        emissive={emissive}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

