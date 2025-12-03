import { ThreeEvent } from "@react-three/fiber";
import { BuildingTooltip } from "./BuildingTooltip";
import type { PlacedObject } from "../../hooks/useGridInteraction";
import { InstancedFlower } from "./InstancedFlower";
import type { CursorData } from "../../hooks/useRealtimeCursors";

interface InteractiveDisplayObjectsProps {
  objects?: PlacedObject[];
  clickedObjectId?: string | null;
  onObjectClick?: (e: ThreeEvent<MouseEvent>, buildingId: string) => void;
  cursors?: CursorData[];
  myCursor?: {
    gridX: number;
    gridZ: number;
  } | null;
  isLightMode?: boolean;
}

export function InteractiveDisplayObjects({
  objects = [],
  clickedObjectId,
  onObjectClick,
  cursors = [],
  myCursor = null,
  isLightMode = false,
}: InteractiveDisplayObjectsProps) {
  return (
    <>
      <InstancedFlower
        objects={objects}
        onObjectClick={onObjectClick}
        cursors={cursors}
        myCursor={myCursor}
        isLightMode={isLightMode}
      />
      {/* Tooltips for clicked objects */}
      {objects.map((object) => {
        if (clickedObjectId !== object.id) return null;
        return (
          <BuildingTooltip
            key={`tooltip-${object.id}`}
            building={object}
            position={[
              object.position[0],
              object.position[1] + 3,
              object.position[2],
            ]}
          />
        );
      })}
    </>
  );
}
