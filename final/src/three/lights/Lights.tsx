import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightsProps {
  isLightMode?: boolean;
}

export function Lights({ isLightMode = false }: LightsProps) {
  const accentLight1Ref = useRef<THREE.PointLight>(null);
  const accentLight2Ref = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame(() => {
    timeRef.current += 0.01;

    if (accentLight1Ref.current) {
      accentLight1Ref.current.intensity = 0.5 + Math.sin(timeRef.current) * 0.2;
    }

    if (accentLight2Ref.current) {
      accentLight2Ref.current.intensity = 0.5 + Math.cos(timeRef.current) * 0.2;
    }
  });

  // Adjust lighting based on mode
  const ambientIntensity = isLightMode ? 0.8 : 0.3;
  const directionalIntensity = isLightMode ? 1.5 : 2.5;

  return (
    <>
      {/* 앰비언트 라이트 */}
      <ambientLight intensity={ambientIntensity} />

      {/* 방향성 조명 */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}

