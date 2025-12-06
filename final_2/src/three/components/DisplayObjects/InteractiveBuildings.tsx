import { BuildingModel } from "./BuildingModel";
import type { PlacedObject } from "../../config/types";

interface InteractiveBuildingsProps {
  buildings: PlacedObject[];
}

/**
 * 인터랙티브 건물 목록 컴포넌트
 * 모든 배치된 건물을 렌더링
 * 클릭 이벤트는 바닥 mesh에서 통합 처리 (hoveredPosition 기반)
 */
export function InteractiveBuildings({ buildings }: InteractiveBuildingsProps) {
  return (
    <>
      {buildings.map((building) => (
        <BuildingModel
          key={building.id}
          id={building.id}
          position={building.position}
          meshIndex={building.meshIndex}
          buildingStructure={building.buildingStructure}
          buildingText={building.buildingText}
        />
      ))}
    </>
  );
}
