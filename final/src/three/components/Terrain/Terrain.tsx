import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM_HEIGHT } from "../../config/constants";
import {
  terrainFragmentShader,
  terrainVertexShader,
} from "../../shaders/terrainShader";

interface TerrainProps {
  size?: number;
  segments?: number;
  displacementScale?: number;
  position?: [number, number, number];
}

export function Terrain({
  size = 10000,
  segments = 1024,
  displacementScale = 1.2,
  position = [0, -ROOM_HEIGHT / 2 - 1.5, 0],
}: TerrainProps) {
  const heightMap = useLoader(THREE.TextureLoader, "/heightmap.png");

  useEffect(() => {
    heightMap.wrapS = THREE.ClampToEdgeWrapping;
    heightMap.wrapT = THREE.ClampToEdgeWrapping;
    heightMap.colorSpace = THREE.LinearSRGBColorSpace;
    heightMap.needsUpdate = true;
  }, [heightMap]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        heightMap: { value: heightMap },
        displacementScale: { value: displacementScale },
      },
      vertexShader: terrainVertexShader,
      fragmentShader: terrainFragmentShader,
      side: THREE.DoubleSide,
    });
  }, [heightMap, displacementScale]);

  useEffect(() => {
    material.uniforms.displacementScale.value = displacementScale;
  }, [material, displacementScale]);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
      frustumCulled
    >
      <planeGeometry args={[size, size, segments, segments]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
