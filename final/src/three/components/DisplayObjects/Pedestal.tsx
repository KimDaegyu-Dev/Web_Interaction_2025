interface PedestalProps {
  position?: [number, number, number];
}

export function Pedestal({ position = [0, -1, 0] }: PedestalProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[0.7, 0.8, 0.3, 32]} />
      <meshStandardMaterial
        color={0x95a5a6}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

