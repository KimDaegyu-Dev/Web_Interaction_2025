import { useMemo } from "react";
import { CannonProvider } from "../../physics/CannonProvider";
import { WreathModel, FloorPlane } from "./WreathModel";
import { WREATH_CONFIG } from "../../config/constants";
import type { WreathInstance } from "../../config/types";

interface WreathPhysicsProps {
  wreaths: WreathInstance[];
  textureUrl: string;
  onWreathDropComplete?: (id: string, finalPosition: [number, number, number]) => void;
}

/**
 * 화환 물리 시뮬레이션 컨테이너
 * 모든 화환을 물리 월드 내에서 관리
 */
export function WreathPhysics({
  wreaths,
  textureUrl,
  onWreathDropComplete,
}: WreathPhysicsProps) {
  // 초기 드롭 위치 계산 (화면 상단에서 랜덤하게 배치)
  const wreathsWithPositions = useMemo(() => {
    return wreaths.map((wreath, index) => ({
      ...wreath,
      // 이미 위치가 있으면 사용, 없으면 드롭 높이에서 시작
      initialPosition: wreath.position[1] > 0
        ? wreath.position
        : [
            wreath.position[0] + (Math.random() - 0.5) * 2, // X 약간 랜덤
            WREATH_CONFIG.DROP_HEIGHT + index * 0.5, // 순차적 드롭을 위해 높이 오프셋
            wreath.position[2] + (Math.random() - 0.5) * 2, // Z 약간 랜덤
          ] as [number, number, number],
    }));
  }, [wreaths]);

  return (
    <CannonProvider>
      {/* 바닥 충돌 평면 */}
      <FloorPlane />

      {/* 화환들 */}
      {wreathsWithPositions.map((wreath) => (
        <WreathModel
          key={wreath.id}
          id={wreath.id}
          position={wreath.initialPosition}
          textureUrl={textureUrl}
          message={wreath.message}
          sender={wreath.sender}
          onDropComplete={onWreathDropComplete}
        />
      ))}
    </CannonProvider>
  );
}
