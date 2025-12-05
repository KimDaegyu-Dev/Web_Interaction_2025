import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OtherCursor } from "@/stores/cameraStore";

interface RealtimeCursorsProps {
  cursors: OtherCursor[];
}

const CURSOR_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#A8E6CF", // Mint
  "#FF8B94", // Pink
  "#B8B5FF", // Purple
  "#F7DC6F", // Gold
  "#85C1E9", // Blue
];

/**
 * 실시간 다른 사용자들의 커서를 표시
 * 부드러운 보간으로 커서 움직임 표현
 */
export function RealtimeCursors({ cursors }: RealtimeCursorsProps) {
  // 각 커서별 현재 위치 (보간용)
  const currentPositions = useRef<Map<string, THREE.Vector3>>(new Map());

  // 커서별 색상 할당
  const getCursorColor = useCallback((userId: string): string => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0;
    }
    return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
  }, []);

  // 애니메이션 프레임 (부드러운 보간)
  useFrame(() => {
    cursors.forEach((cursor) => {
      const current = currentPositions.current.get(cursor.userId);
      const target = new THREE.Vector3(cursor.gridX, 0.5, cursor.gridZ);

      if (current) {
        // 부드러운 보간 (lerp factor 0.1)
        current.lerp(target, 0.1);
      } else {
        currentPositions.current.set(cursor.userId, target.clone());
      }
    });

    // 오래된 커서 정리
    const cursorIds = new Set(cursors.map((c) => c.userId));
    for (const key of currentPositions.current.keys()) {
      if (!cursorIds.has(key)) {
        currentPositions.current.delete(key);
      }
    }
  });

  return (
    <group name="realtime-cursors">
      {cursors.map((cursor) => (
        <CursorIndicator
          key={cursor.userId}
          cursor={cursor}
          color={getCursorColor(cursor.userId)}
          currentPositions={currentPositions}
        />
      ))}
    </group>
  );
}

interface CursorIndicatorProps {
  cursor: OtherCursor;
  color: string;
  currentPositions: React.MutableRefObject<Map<string, THREE.Vector3>>;
}

function CursorIndicator({
  cursor,
  color,
  currentPositions,
}: CursorIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // 링 애니메이션
  useFrame((state) => {
    if (groupRef.current) {
      const pos = currentPositions.current.get(cursor.userId);
      if (pos) {
        groupRef.current.position.copy(pos);
      }
    }

    // 맥박 애니메이션
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  // 색상을 THREE.Color로 변환
  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group ref={groupRef}>
      {/* 중앙 점 */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 맥박 링 */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshBasicMaterial color={threeColor} transparent opacity={0.5} />
      </mesh>

      {/* 사용자 이름 (선택 사항) */}
      {/* <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="bottom"
      >
        {cursor.userId.slice(0, 8)}
      </Text> */}
    </group>
  );
}
