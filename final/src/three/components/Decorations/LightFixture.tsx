export function LightFixture() {
  return (
    <mesh position={[0, 2, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color={0xfff5e1}
        emissive={0xfff5e1}
        emissiveIntensity={1}
      />
    </mesh>
  );
}

