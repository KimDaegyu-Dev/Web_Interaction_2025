import { useRef, useEffect, useState, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { WREATH_CONFIG } from "../../config/constants";

interface WreathModelProps {
  id: string;
  position: [number, number, number];
  textureUrl: string;
  message?: string | null;
  sender?: string | null;
  onDropComplete?: (id: string, finalPosition: [number, number, number]) => void;
}

/**
 * 3단 화환 모델 (2D 텍스처 + 물리 시뮬레이션)
 * PlaneGeometry에 화환 이미지 텍스처 적용
 */
export const WreathModel = memo(function WreathModel({
  id,
  position,
  textureUrl,
  message,
  sender,
  onDropComplete,
}: WreathModelProps) {
  const [hasDropped, setHasDropped] = useState(false);
  const previousVelocity = useRef<number>(0);
  const dropCheckCount = useRef<number>(0);

  // 물리 바디 생성 (Box로 충돌 처리)
  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: WREATH_CONFIG.PHYSICS.MASS,
    position,
    args: [WREATH_CONFIG.SIZE[0], WREATH_CONFIG.SIZE[1], 0.1],
    material: {
      friction: WREATH_CONFIG.PHYSICS.FRICTION,
      restitution: WREATH_CONFIG.PHYSICS.RESTITUTION,
    },
  }));

  // 속도 구독하여 정지 감지
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((velocity) => {
      const speed = Math.sqrt(
        velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2
      );

      // 속도가 매우 낮으면 정지로 간주
      if (speed < 0.1 && previousVelocity.current < 0.1) {
        dropCheckCount.current++;
        
        // 연속으로 정지 상태 유지 시 드롭 완료
        if (dropCheckCount.current > 30 && !hasDropped) {
          setHasDropped(true);
          
          // 최종 위치 가져오기
          api.position.subscribe((pos) => {
            onDropComplete?.(id, [pos[0], pos[1], pos[2]]);
          })();
        }
      } else {
        dropCheckCount.current = 0;
      }

      previousVelocity.current = speed;
    });

    return () => unsubscribe();
  }, [api, id, onDropComplete, hasDropped]);

  // 텍스처 로드
  const texture = new THREE.TextureLoader().load(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh ref={ref} castShadow>
      <planeGeometry args={WREATH_CONFIG.SIZE} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

/**
 * 바닥 평면 (충돌용)
 */
export function FloorPlane() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: "Static",
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f5f5f5" transparent opacity={0} />
    </mesh>
  );
}
