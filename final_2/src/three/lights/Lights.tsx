interface LightsProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
}

/**
 * 씬 조명 컴포넌트
 */
export function Lights({
  ambientIntensity = 0.6,
  directionalIntensity = 0.8,
}: LightsProps) {
  return (
    <>
      {/* 환경광 */}
      <ambientLight intensity={ambientIntensity} />
      
      {/* 주 방향광 (태양) */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* 보조 방향광 (반사광 효과) */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={directionalIntensity * 0.3}
      />
    </>
  );
}
