import * as THREE from "three";
import { GRID_CONFIG } from "../../config/grid";

interface GridHighlightProps {
  hoveredCell: { x: number; z: number } | null;
}

/**
 * 그리드 강조 메시 컴포넌트
 */
export function GridHighlight({
  hoveredCell,
}: GridHighlightProps) {
  if (!hoveredCell) {
    return null;
  }

  return (
    <mesh
      position={[
        hoveredCell.x,
        GRID_CONFIG.GRID_Y_OFFSET, // 바닥보다 약간 위에 배치
        hoveredCell.z,
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry
        args={[
          GRID_CONFIG.CELL_SIZE - GRID_CONFIG.CELL_PADDING,
          GRID_CONFIG.CELL_SIZE - GRID_CONFIG.CELL_PADDING,
        ]}
      />
      <meshStandardMaterial
        color={GRID_CONFIG.COLORS.HIGHLIGHT_DEFAULT}
        emissive={GRID_CONFIG.COLORS.EMISSIVE_DEFAULT}
        emissiveIntensity={0.3}
        roughness={0.8}
        metalness={0.2}
        transparent
        opacity={GRID_CONFIG.OPACITY.DEFAULT}
      />
    </mesh>
  );
}

