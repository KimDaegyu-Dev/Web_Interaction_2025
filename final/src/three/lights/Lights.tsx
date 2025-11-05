import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Lights() {
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

  return (
    <>
      {/* 앰비언트 라이트 */}
      <ambientLight intensity={0.3} />

      {/* 메인 포인트 라이트 */}
      <pointLight
        position={[0, 2, 0]}
        intensity={1}
        distance={20}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color={0xfff5e1}
      />

      {/* 악센트 라이트 1 */}
      <pointLight
        ref={accentLight1Ref}
        position={[-3, 1, -3]}
        intensity={0.5}
        distance={10}
        color={0x80d4ff}
      />

      {/* 악센트 라이트 2 */}
      <pointLight
        ref={accentLight2Ref}
        position={[3, 1, 3]}
        intensity={0.5}
        distance={10}
        color={0xff80aa}
      />

      {/* 방향성 조명 */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
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

