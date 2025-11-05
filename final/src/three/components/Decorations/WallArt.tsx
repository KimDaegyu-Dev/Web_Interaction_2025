import { ROOM_SIZE } from '../../config/constants';

interface FrameProps {
  position: [number, number, number];
}

function Frame({ position }: FrameProps) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1.5, 2, 0.1]} />
      <meshStandardMaterial
        color={0x2c3e50}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}

interface ArtworkProps {
  position: [number, number, number];
  color: number;
}

function Artwork({ position, color }: ArtworkProps) {
  return (
    <mesh position={position}>
      <planeGeometry args={[1.3, 1.8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export function WallArt() {
  const zPosition = -ROOM_SIZE / 2;

  return (
    <>
      {/* 왼쪽 액자 */}
      <Frame position={[-2, 0.5, zPosition + 0.05]} />
      <Artwork position={[-2, 0.5, zPosition + 0.11]} color={0xe74c3c} />

      {/* 오른쪽 액자 */}
      <Frame position={[2, 0.5, zPosition + 0.05]} />
      <Artwork position={[2, 0.5, zPosition + 0.11]} color={0x3498db} />
    </>
  );
}

