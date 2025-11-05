import { ROOM_SIZE, ROOM_HEIGHT, PATTERN_SIZE } from '../../config/constants';

export function FloorPattern() {
  const tiles: JSX.Element[] = [];

  for (let x = -ROOM_SIZE / 2; x < ROOM_SIZE / 2; x += PATTERN_SIZE) {
    for (let z = -ROOM_SIZE / 2; z < ROOM_SIZE / 2; z += PATTERN_SIZE) {
      if (
        (Math.floor(x / PATTERN_SIZE) + Math.floor(z / PATTERN_SIZE)) % 2 === 0
      ) {
        const key = `tile-${x}-${z}`;
        tiles.push(
          <mesh
            key={key}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
              x + PATTERN_SIZE / 2,
              -ROOM_HEIGHT / 2 + 0.01,
              z + PATTERN_SIZE / 2,
            ]}
            receiveShadow
          >
            <planeGeometry args={[PATTERN_SIZE, PATTERN_SIZE]} />
            <meshStandardMaterial
              color={0x1e272e}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        );
      }
    }
  }

  return <>{tiles}</>;
}

