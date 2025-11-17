import { ThreeEvent } from "@react-three/fiber";
import { InteractiveCube } from "./InteractiveCube";
import { Pedestal } from "./Pedestal";
import { CubeTooltip } from "./CubeTooltip";
import { useHoverInteraction } from "../../hooks/useHoverInteraction";
import type { Cube } from "../../hooks/useGridInteraction";

interface InteractiveDisplayObjectsProps {
  dynamicCubes?: Cube[];
  onCubeClick?: (e: ThreeEvent<MouseEvent>, cubeId: string) => void;
}

export function InteractiveDisplayObjects({
  dynamicCubes = [],
  onCubeClick,
}: InteractiveDisplayObjectsProps) {
  const { hoveredObject, onPointerOver, onPointerOut } = useHoverInteraction();

  return (
    <>
      {/* 기존 큐브들 */}
      <InteractiveCube
        position={[0, -2, 0]}
        color={0x6c5ce7}
        emissive={0x4a3f8f}
        rotationSpeed={[0.01, 0.01]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        hovered={hoveredObject?.position.z === 0}
      />
      <Pedestal position={[0, -3, 0]} />

      <InteractiveCube
        position={[0, -2, 3]}
        color={0xff6b9d}
        emissive={0xff4757}
        rotationSpeed={[-0.008, -0.008]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        hovered={hoveredObject?.position.z === 3}
      />
      <Pedestal position={[0, -3, 3]} />

      {/* 동적으로 생성된 큐브들 */}
      {dynamicCubes.map((cube) => {
        const isHovered =
          hoveredObject?.position.x === cube.position[0] &&
          hoveredObject?.position.z === cube.position[2];

        return (
          <group key={cube.id}>
            <InteractiveCube
              position={cube.position}
              color={cube.color}
              emissive={cube.color}
              rotationSpeed={[0.005, 0.005]}
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              hovered={isHovered}
              onClick={(e) => onCubeClick && onCubeClick(e, cube.id)}
            />
            <Pedestal
              position={[
                cube.position[0],
                cube.position[1] - 1,
                cube.position[2],
              ]}
            />
            {/* 호버 시 제목과 작성자 표시 */}
            {isHovered && (
              <CubeTooltip
                cube={cube}
                position={[
                  cube.position[0],
                  cube.position[1] + 1,
                  cube.position[2],
                ]}
              />
            )}
          </group>
        );
      })}
    </>
  );
}
