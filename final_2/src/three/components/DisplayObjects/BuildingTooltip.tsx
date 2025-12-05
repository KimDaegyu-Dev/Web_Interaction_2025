import { Html } from "@react-three/drei";
import type { PlacedObject } from "../../config/types";

interface BuildingTooltipProps {
  building: PlacedObject;
  position: [number, number, number];
}

/**
 * 건물 정보 툴팁 컴포넌트
 * 선택된 건물 위에 HTML 오버레이로 표시
 */
export function BuildingTooltip({ building, position }: BuildingTooltipProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      style={{
        pointerEvents: "none",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 min-w-[150px] text-center">
        {building.title && (
          <h3 className="font-bold text-gray-800 text-sm mb-1">
            {building.title}
          </h3>
        )}
        {building.author && (
          <p className="text-gray-600 text-xs">
            by {building.author}
          </p>
        )}
        {building.buildingText && (
          <p className="text-gray-500 text-xs mt-1 italic">
            "{building.buildingText}"
          </p>
        )}
      </div>
    </Html>
  );
}
