import { ROOM_SIZE, ROOM_HEIGHT } from '../../config/constants';

export function Pillars() {
  const pillarPositions: [number, number, number][] = [
    [-ROOM_SIZE / 2 + 0.2, 0, -ROOM_SIZE / 2 + 0.2],
    [ROOM_SIZE / 2 - 0.2, 0, -ROOM_SIZE / 2 + 0.2],
    [-ROOM_SIZE / 2 + 0.2, 0, ROOM_SIZE / 2 - 0.2],
    [ROOM_SIZE / 2 - 0.2, 0, ROOM_SIZE / 2 - 0.2],
  ];

  return (
    <>
      {pillarPositions.map((pos, index) => (
        <mesh key={`pillar-${index}`} position={pos} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, ROOM_HEIGHT, 8]} />
          <meshStandardMaterial
            color={0x34495e}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      ))}
    </>
  );
}

