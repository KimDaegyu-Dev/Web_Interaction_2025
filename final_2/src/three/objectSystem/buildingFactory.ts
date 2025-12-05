import * as THREE from "three";
import { csgBuildingCache } from "./CSGBuildingCache";
import { getBuildingStructure } from "../config/buildingPresets";
import type { BuildingStructureBox } from "@/utils/supabase";

/**
 * 건물 생성 옵션
 */
export interface BuildingFactoryOptions {
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  color?: THREE.ColorRepresentation;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

/**
 * 건물 지오메트리 생성 팩토리
 * CSG 캐시를 활용하여 효율적으로 건물 메시 생성
 */
export function createBuildingGeometry(
  meshIndex: number,
  buildingStructure?: BuildingStructureBox[] | null
): THREE.BufferGeometry {
  // DB에 저장된 커스텀 구조가 있으면 사용
  if (buildingStructure && buildingStructure.length > 0) {
    const cacheKey = `custom_${JSON.stringify(buildingStructure)}`;
    return csgBuildingCache.getGeometryFromStructure(buildingStructure, cacheKey);
  }

  // 프리셋 기반 지오메트리 생성
  return csgBuildingCache.getGeometry(meshIndex);
}

/**
 * 건물 메시 생성
 */
export function createBuildingMesh(options: BuildingFactoryOptions): THREE.Mesh {
  const {
    meshIndex,
    buildingStructure,
    color = 0xffffff,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  } = options;

  // 지오메트리 생성 (캐시 활용)
  const geometry = createBuildingGeometry(meshIndex, buildingStructure);

  // 머티리얼 생성 (흰색 기본)
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.7,
    metalness: 0.1,
  });

  // 메시 생성
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

/**
 * 텍스트를 표시할 건물 외벽 면 정보 계산
 * 가장 넓은 면을 찾아 반환
 */
export function getTextWallInfo(
  meshIndex: number,
  buildingStructure?: BuildingStructureBox[] | null
): {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
} {
  const structure = buildingStructure?.length
    ? buildingStructure
    : getBuildingStructure(meshIndex);

  // 가장 큰 박스 찾기 (텍스트 표시용)
  let maxArea = 0;
  let targetBox = structure[0];

  structure.forEach((box) => {
    // 전면(XY 평면) 면적 계산
    const area = box.scale[0] * box.scale[1];
    if (area > maxArea) {
      maxArea = area;
      targetBox = box;
    }
  });

  // 텍스트 위치: 박스 전면 중앙
  const textPosition: [number, number, number] = [
    targetBox.position[0],
    targetBox.position[1],
    targetBox.position[2] + targetBox.scale[2] / 2 + 0.01, // Z축 전면
  ];

  return {
    position: textPosition,
    rotation: [0, 0, 0], // 전면을 바라봄
    width: targetBox.scale[0],
    height: targetBox.scale[1],
  };
}
