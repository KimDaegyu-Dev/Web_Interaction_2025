import { ThreeEvent } from "@react-three/fiber";
import { BuildingTooltip } from "./BuildingTooltip";
import type { PlacedObject } from "../../hooks/useGridInteraction";
import { StatefulModelInstance } from "../../objectSystem/StatefulModelInstance";
import { getModelDefinition } from "../../objectSystem/modelLibrary";
import type { ObjectStateKey } from "../../objectSystem/modelLibrary";
import type { CursorData } from "../../hooks/useRealtimeCursors";

interface InteractiveDisplayObjectsProps {
  objects?: PlacedObject[];
  clickedObjectId?: string | null;
  onObjectClick?: (e: ThreeEvent<MouseEvent>, buildingId: string) => void;
  onRequestStateChange?: (id: string, nextState: ObjectStateKey) => void;
  cursors?: CursorData[];
  myCursor?: {
    gridX: number;
    gridZ: number;
  } | null;
}

export function InteractiveDisplayObjects({
  objects = [],
  clickedObjectId,
  onObjectClick,
  onRequestStateChange,
  cursors = [],
  myCursor = null,
}: InteractiveDisplayObjectsProps) {
  return (
    <>
      {objects.map((object) => {
        const definition = getModelDefinition(object.modelKey);

        if (!definition) {
          return null;
        }

        const isClicked = clickedObjectId === object.id;

        return (
          <group key={object.id}>
            <StatefulModelInstance
              instance={object}
              definition={definition}
              onClick={onObjectClick}
              onRequestStateChange={onRequestStateChange}
              cursors={cursors}
              myCursor={myCursor}
            />
            {isClicked && (
              <BuildingTooltip
                building={object}
                position={[
                  object.position[0],
                  object.position[1] + 3,
                  object.position[2],
                ]}
              />
            )}
          </group>
        );
      })}
    </>
  );
}
