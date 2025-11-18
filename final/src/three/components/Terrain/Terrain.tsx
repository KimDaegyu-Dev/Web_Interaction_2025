import { useRef, useMemo } from "react";
import * as THREE from "three";

interface TerrainProps {
  size?: number;
  segments?: number;
  color?: string;
  wireframe?: boolean;
  tileCount?: number;
}

/**
 * 간단한 노이즈 함수 (Perlin-like)
 */
function noise(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

/**
 * 프랙탈 노이즈 (여러 주파수 결합)
 */
function fractalNoise(x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1.0;
  let maxValue = 1;

  for (let i = 0; i < octaves; i++) {
    value += noise(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.1;
    frequency *= 2;
  }

  return value / maxValue;
}

/**
 * 연속적인 지형 메시 컴포넌트
 * 큰 평면을 생성하여 무한한 지형처럼 보이도록 함
 * 여러 타일을 배치하여 연속성 확보
 */
export function Terrain({
  size = 1000,
  segments = 500,
  color = "#8b9a6b",
  wireframe = false,
  tileCount = 3,
}: TerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // 전체 지형 크기 계산
  const totalSize = size * tileCount;
  const totalSegments = segments * tileCount;

  // 지형 지오메트리 생성 (높이 변형을 위한 버퍼 지오메트리)
  // 하나의 큰 지오메트리로 생성하여 완벽한 연속성 보장
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      totalSize,
      totalSize,
      totalSegments,
      totalSegments,
    );

    // 약간의 높이 변형을 추가하여 자연스러운 지형 느낌
    const positions = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);

      // 프랙탈 노이즈를 사용한 더 자연스러운 높이 변형
      // 절대 좌표를 사용하여 연속성 보장
      const height = fractalNoise(vertex.x, vertex.y) * 2;
      vertex.z = height;

      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();

    return geo;
  }, [totalSize, totalSegments]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.1}
        wireframe={wireframe}
      />
    </mesh>
  );
}
