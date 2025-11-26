import { useTexture } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GRID_CONFIG } from "../../config/grid";
import type { PlacedObject } from "../../hooks/useGridInteraction";

const TILE_TEXTURES = [
  "./texture/tile1.jpg",
  "./texture/tile2.jpg",
  "./texture/tile3.jpg",
  "./texture/tile4.jpg",
  "./texture/tile5.jpg",
  "./texture/tile6.jpg",
  "./texture/tile7.jpg",
];

interface GridFloorProps {
  objects: PlacedObject[];
}

const GRID_SIZE = 40; // 40x40 grid
const HALF_GRID = GRID_SIZE / 2;

export function GridFloor({ objects }: GridFloorProps) {
  const textures = useTexture(TILE_TEXTURES);
  
  useLayoutEffect(() => {
    textures.forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      // Texture appears to be 2x2 tiles, zoom in to show 1 tile per cell
      texture.repeat.set(1, 1);
    });
  }, [textures]);

  // Group objects by texture index for InstancedMesh
  const instancesByTexture = useMemo(() => {
    const groups: { x: number; z: number }[][] = Array(TILE_TEXTURES.length)
      .fill(null)
      .map(() => []);
    
    objects.forEach((obj) => {
      // Deterministic texture selection based on object ID or position
      // Using position string to ensure stability if ID changes or for simplicity
      // But ID is better if available. obj.id is a string.
      const hash = obj.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const textureIndex = hash % TILE_TEXTURES.length;
      
      groups[textureIndex].push({ x: obj.position[0], z: obj.position[2] });
    });
    
    return groups;
  }, [objects]);

  return (
    <group position={[0, GRID_CONFIG.FLOOR_LEVEL + 0.01, 0]}>
      {instancesByTexture.map((instances, textureIndex) => (
        <InstancedTileLayer
          key={textureIndex}
          texture={textures[textureIndex]}
          instances={instances}
        />
      ))}
    </group>
  );
}

function InstancedTileLayer({
  texture,
  instances,
}: {
  texture: THREE.Texture;
  instances: { x: number; z: number }[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    instances.forEach((instance, i) => {
      dummy.position.set(instance.x, 0, instance.z);
      dummy.rotation.x = -Math.PI / 2;
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [instances, dummy]);

  if (instances.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, instances.length]}
    >
      <planeGeometry
        args={[
          GRID_CONFIG.CELL_SIZE - GRID_CONFIG.CELL_PADDING,
          GRID_CONFIG.CELL_SIZE - GRID_CONFIG.CELL_PADDING,
        ]}
      />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0.1}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}
