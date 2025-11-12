import * as THREE from "three";
import { ROOM_HEIGHT } from "../../config/constants";

interface GridHighlightProps {
  hoveredCell: { x: number; z: number } | null;
  isShiftPressed: boolean;
}

/**
 * 그리드 강조 메시 컴포넌트
 */
export function GridHighlight({
  hoveredCell,
  isShiftPressed,
}: GridHighlightProps) {
  if (!hoveredCell) {
    return null;
  }

  return (
    <mesh
      position={[
        hoveredCell.x,
        -ROOM_HEIGHT / 2 + 0.02, // 바닥보다 약간 위에 배치
        hoveredCell.z,
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[0.95, 0.95]} />
      <meshStandardMaterial
        color={isShiftPressed ? 0x00ff00 : 0x4a90e2}
        emissive={isShiftPressed ? 0x00ff00 : 0x4a90e2}
        emissiveIntensity={isShiftPressed ? 0.8 : 0.3}
        roughness={0.8}
        metalness={0.2}
        transparent
        opacity={isShiftPressed ? 1.0 : 0.7}
      />
    </mesh>
  );
}

