import { Cube } from './Cube';
import { Pedestal } from './Pedestal';

export function DisplayObjects() {
  return (
    <>
      {/* 첫 번째 큐브 */}
      <Cube position={[0, 0, 0]} color={0x6c5ce7} emissive={0x4a3f8f} rotationSpeed={[0.01, 0.01]} />
      <Pedestal position={[0, -1, 0]} />

      {/* 두 번째 큐브 */}
      <Cube position={[0, 0, 3]} color={0xff6b9d} emissive={0xff4757} rotationSpeed={[-0.008, -0.008]} />
      <Pedestal position={[0, -1, 3]} />
    </>
  );
}

