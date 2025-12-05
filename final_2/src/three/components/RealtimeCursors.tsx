import { useRef, useMemo, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import type { OtherCursor } from "@/stores/cameraStore";

interface RealtimeCursorsProps {
  cursors: OtherCursor[];
  myCursor?: { gridX: number; gridZ: number; color?: string } | null;
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

// 공유 지오메트리 (WebGL 컨텍스트 손실 방지)
const sharedSphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const sharedRingGeometry = new THREE.RingGeometry(0.3, 0.5, 32);

/**
 * 실시간 커서 표시 컴포넌트
 * 내 커서 + 다른 사용자들의 커서를 표시
 */
export function RealtimeCursors({ cursors, myCursor }: RealtimeCursorsProps) {
  // 커서별 색상 할당
  const getCursorColor = useCallback((userId: string): string => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0;
    }
    return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
  }, []);

  return (
    <group name="realtime-cursors">
      {/* 내 커서 - 특별한 스타일 */}
      {myCursor && (
        <CursorIndicator
          key="my-cursor"
          gridX={myCursor.gridX}
          gridZ={myCursor.gridZ}
          color={myCursor.color || "#FFFFFF"}
          isMe={true}
        />
      )}
      
      {/* 다른 사용자들의 커서 */}
      {cursors.map((cursor) => (
        <CursorIndicator
          key={cursor.userId}
          gridX={cursor.gridX}
          gridZ={cursor.gridZ}
          color={getCursorColor(cursor.userId)}
          isMe={false}
        />
      ))}
    </group>
  );
}

interface CursorIndicatorProps {
  gridX: number;
  gridZ: number;
  color: string;
  isMe: boolean;
}

function CursorIndicator({
  gridX,
  gridZ,
  color,
  isMe,
}: CursorIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // 공유 머티리얼 (메모리 절약)
  const materials = useMemo(() => ({
    sphere: new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: isMe ? 2.0 : 1.5,
      transparent: true,
      opacity: isMe ? 0.9 : 0.8,
    }),
    ring: new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: isMe ? 0.5 : 0.3,
      side: THREE.DoubleSide,
    }),
  }), [color, isMe]);

  // 머티리얼 정리
  useEffect(() => {
    return () => {
      materials.sphere.dispose();
      materials.ring.dispose();
    };
  }, [materials]);

  // GSAP 부드러운 위치 보간
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        x: gridX,
        z: gridZ,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, [gridX, gridZ]);

  // 애니메이션 프레임
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // 부드러운 부유 애니메이션
      const float = Math.sin(clock.getElapsedTime() * 2) * 0.1;
      meshRef.current.position.y = 0.5 + float;
      
      // 회전 애니메이션
      meshRef.current.rotation.y += isMe ? 0.03 : 0.02;
    }

    if (ringRef.current) {
      // 맥박 애니메이션
      const scale = 1 + Math.sin(clock.getElapsedTime() * (isMe ? 4 : 3)) * 0.2;
      ringRef.current.scale.set(scale, scale, 1);
      
      if (isMe) {
        ringRef.current.rotation.z += 0.01;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* 포인트 라이트 (조명) */}
      <pointLight
        color={color}
        intensity={isMe ? 2.5 : 2}
        distance={isMe ? 6 : 5}
        decay={2}
        position={[0, 0.5, 0]}
      />

      {/* 빛나는 구체 */}
      <mesh 
        ref={meshRef} 
        position={[0, 0.5, 0]} 
        geometry={sharedSphereGeometry} 
        material={materials.sphere} 
      />

      {/* 바닥 링 */}
      <mesh 
        ref={ringRef}
        scale={[isMe ? 4 : 3, isMe ? 4 : 3, 1]}
        position={[0, 0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={sharedRingGeometry}
        material={materials.ring}
      />
    </group>
  );
}
