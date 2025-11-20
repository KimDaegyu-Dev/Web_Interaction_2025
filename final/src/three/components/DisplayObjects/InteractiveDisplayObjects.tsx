import { ThreeEvent } from "@react-three/fiber";
import { BuildingTooltip } from "./BuildingTooltip";
import type { PlacedObject } from "../../hooks/useGridInteraction";
import { StatefulModelInstance } from "../../objectSystem/StatefulModelInstance";
import { getModelDefinition } from "../../objectSystem/modelLibrary";
import type { ObjectStateKey } from "../../objectSystem/modelLibrary";

interface InteractiveDisplayObjectsProps {
  objects?: PlacedObject[];
  hoveredObjectId?: string | null;
  onObjectClick?: (e: ThreeEvent<MouseEvent>, buildingId: string) => void;
  onObjectPointerOver?: (e: ThreeEvent<PointerEvent>, buildingId: string) => void;
  onObjectPointerOut?: (e: ThreeEvent<PointerEvent>, buildingId: string) => void;
  onRequestStateChange?: (id: string, nextState: ObjectStateKey) => void;
}

export function InteractiveDisplayObjects({
  objects = [],
  hoveredObjectId,
  onObjectClick,
  onObjectPointerOver,
  onObjectPointerOut,
  onRequestStateChange,
}: InteractiveDisplayObjectsProps) {
  return (
    <>
      {objects.map((object) => {
        const definition = getModelDefinition(object.modelKey);

        if (!definition) {
          return null;
        }

        const isHovered = hoveredObjectId === object.id;

        return (
          <group key={object.id}>
            <StatefulModelInstance
              instance={object}
              definition={definition}
              hovered={isHovered}
              onPointerOver={onObjectPointerOver}
              onPointerOut={onObjectPointerOut}
              onClick={(e) => onObjectClick?.(e, object.id)}
              onRequestStateChange={onRequestStateChange}
            />
            {isHovered && (
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
