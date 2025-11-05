import { ROOM_SIZE, ROOM_HEIGHT } from '../../config/constants';

export function Ceiling() {
  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, ROOM_HEIGHT / 2, 0]}
      receiveShadow
    >
      <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
      <meshStandardMaterial
        color={0x34495e}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

