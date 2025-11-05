import { ROOM_SIZE, ROOM_HEIGHT } from '../../config/constants';

export function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -ROOM_HEIGHT / 2, 0]}
      receiveShadow
    >
      <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
      <meshStandardMaterial
        color={0x2d3436}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

