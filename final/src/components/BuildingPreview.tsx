import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { StatefulModelInstance } from "../three/objectSystem/StatefulModelInstance";
import { getModelDefinition } from "../three/objectSystem/modelLibrary";
import { MODEL_CONFIG } from "../three/config/models";

interface BuildingPreviewProps {
  meshIndex: number;
}

export function BuildingPreview({ meshIndex }: BuildingPreviewProps) {
  // Find the building type with this mesh index
  const buildingType = MODEL_CONFIG.BUILDING_TYPES.find(
    (type) => type.meshIndex === meshIndex
  );
  
  if (!buildingType) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ color: "#666" }}>
        <div className="text-center">
          <div className="text-sm">프리뷰 없음</div>
        </div>
      </div>
    );
  }

  const definition = getModelDefinition(buildingType.key);

  if (!definition) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ color: "#666" }}>
        <div className="text-center">
          <div className="text-sm">프리뷰 없음</div>
        </div>
      </div>
    );
  }

  // Create a mock instance for preview
  const mockInstance = {
    id: `preview_${meshIndex}`,
    modelKey: definition.key,
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    state: "idle" as const,
    restState: "idle" as const,
    metadata: {},
  };

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 1.5, 2]} fov={45} />
        
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
        />
        <Suspense fallback={null}>
          <group scale={[2, 2, 2]}>
            <StatefulModelInstance
              instance={mockInstance}
              definition={definition}
            />
          </group>
        </Suspense>
        
      </Canvas>
    </div>
  );
}

