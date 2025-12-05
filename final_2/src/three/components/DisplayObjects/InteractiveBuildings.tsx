import { ThreeEvent } from "@react-three/fiber";
import { BuildingModel } from "./BuildingModel";
import { BuildingTooltip } from "./BuildingTooltip";
import type { PlacedObject } from "../../config/types";

interface InteractiveBuildingsProps {
  buildings: PlacedObject[];
  selectedBuildingId?: string | null;
  onBuildingClick?: (e: ThreeEvent<MouseEvent>, buildingId: string) => void;
}

/**
 * 인터랙티브 건물 목록 컴포넌트
 * 모든 배치된 건물을 렌더링하고 클릭 이벤트 처리
 */
export function InteractiveBuildings({
  buildings,
  selectedBuildingId,
  onBuildingClick,
}: InteractiveBuildingsProps) {
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
          onClick={onBuildingClick}
          isSelected={selectedBuildingId === building.id}
        />
      ))}

      {/* 선택된 건물 툴팁 */}
      {buildings.map((building) => {
        if (selectedBuildingId !== building.id) return null;
        return (
          <BuildingTooltip
            key={`tooltip-${building.id}`}
            building={building}
            position={[
              building.position[0],
              building.position[1] + 5, // 건물 위에 표시
              building.position[2],
            ]}
          />
        );
      })}
    </>
  );
}
