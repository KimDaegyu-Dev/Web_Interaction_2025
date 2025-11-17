import { Text } from "@react-three/drei";
import type { Cube } from "../../hooks/useGridInteraction";

interface CubeTooltipProps {
  cube: Cube;
  position: [number, number, number];
}

export function CubeTooltip({ cube, position }: CubeTooltipProps) {
  if (!cube.title && !cube.author) {
    return null;
  }

  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      {/* 배경 평면 */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 0.6]} />
        <meshBasicMaterial
          color="#000000"
          opacity={0.8}
          transparent
          depthWrite={false}
        />
      </mesh>
      {/* 제목 */}
      {cube.title && (
        <Text
          position={[0, 0.15, 0.01]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          textAlign="center"
        >
          {cube.title}
        </Text>
      )}
      {/* 작성자 */}
      {cube.author && (
        <Text
          position={[0, -0.1, 0.01]}
          fontSize={0.1}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          textAlign="center"
        >
          {cube.author}
        </Text>
      )}
    </group>
  );
}
