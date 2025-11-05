import { ROOM_SIZE, ROOM_HEIGHT } from '../../config/constants';

const wallMaterialProps = {
  color: 0x3d5a80,
  roughness: 0.7,
  metalness: 0.3,
};

export function Walls() {
  return (
    <>
      {/* 뒷벽 */}
      <mesh position={[0, 0, -ROOM_SIZE / 2]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_HEIGHT]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>

      {/* 앞벽 */}
      <mesh
        position={[0, 0, ROOM_SIZE / 2]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_SIZE, ROOM_HEIGHT]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>

      {/* 왼쪽 벽 */}
      <mesh
        position={[-ROOM_SIZE / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_SIZE, ROOM_HEIGHT]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>

      {/* 오른쪽 벽 */}
      <mesh
        position={[ROOM_SIZE / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM_SIZE, ROOM_HEIGHT]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>
    </>
  );
}

