import { InteractiveCube } from './InteractiveCube';
import { Pedestal } from './Pedestal';
import { useHoverInteraction } from '../../hooks/useHoverInteraction';

export function InteractiveDisplayObjects() {
  const { hoveredObject, onPointerOver, onPointerOut } = useHoverInteraction();

  return (
    <>
      {/* 첫 번째 큐브 */}
      <InteractiveCube
        position={[0, 0, 0]}
        color={0x6c5ce7}
        emissive={0x4a3f8f}
        rotationSpeed={[0.01, 0.01]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        hovered={hoveredObject?.position.z === 0}
      />
      <Pedestal position={[0, -1, 0]} />

      {/* 두 번째 큐브 */}
      <InteractiveCube
        position={[0, 0, 3]}
        color={0xff6b9d}
        emissive={0xff4757}
        rotationSpeed={[-0.008, -0.008]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        hovered={hoveredObject?.position.z === 3}
      />
      <Pedestal position={[0, -1, 3]} />
    </>
  );
}

