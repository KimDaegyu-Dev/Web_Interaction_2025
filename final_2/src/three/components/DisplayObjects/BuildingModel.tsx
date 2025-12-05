import { useMemo, useEffect, memo } from "react";
import * as THREE from "three";
import { createBuildingGeometry, getTextWallInfo } from "../../objectSystem/buildingFactory";
import { getBuildingStructure } from "../../config/buildingPresets";
import { BUILDING_CONFIG } from "../../config/constants";
import {
  createProjectedTextureMaterial,
  updateProjectedTexture,
  type ProjectionDirection,
} from "../../shaders/projectedTextureMaterial";
import { createVerticalTextTexture } from "../../utils/textureUtils";
import {
  createBuildingEdgesGeometry,
  calculateBoundingBox,
} from "../../utils/buildingGeometry";
import type { BuildingStructureBox } from "@/utils/supabase";

interface BuildingModelProps {
  id: string;
  position: [number, number, number];
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  buildingText?: string | null;
  color?: THREE.ColorRepresentation;
  isSelected?: boolean;
}

/**
 * 텍스트 벽 회전값에서 투영 방향 결정
 */
function getProjectionDirectionFromRotation(ry: number): ProjectionDirection {
  // ry = 0: +Z 방향, ry = Math.PI/2: +X 방향, etc.
  if (Math.abs(ry) < 0.1) return "z";
  if (Math.abs(ry - Math.PI / 2) < 0.1) return "x";
  if (Math.abs(ry - Math.PI) < 0.1 || Math.abs(ry + Math.PI) < 0.1) return "-z";
  if (Math.abs(ry + Math.PI / 2) < 0.1) return "-x";
  return "z";
}

/**
 * CSG 기반 건물 모델 컴포넌트
 * - 흰색 건물에 검은 엣지 라인
 * - 프로젝터 방식으로 텍스트를 건물 표면에 투사
 */
export const BuildingModel = memo(function BuildingModel({
  id,
  position,
  meshIndex,
  buildingStructure,
  buildingText,
  color = BUILDING_CONFIG.DEFAULT_COLOR,
  isSelected = false,
}: BuildingModelProps) {
  // 건물 구조 가져오기
  const structure = useMemo(() => {
    return buildingStructure?.length
      ? buildingStructure
      : getBuildingStructure(meshIndex);
  }, [meshIndex, buildingStructure]);

  // CSG 지오메트리 생성 (캐시 활용)
  const geometry = useMemo(() => {
    return createBuildingGeometry(meshIndex, buildingStructure);
  }, [meshIndex, buildingStructure]);

  // 바운딩 박스 계산
  const boundingBox = useMemo(() => {
    return calculateBoundingBox(structure);
  }, [structure]);

  // 투영 방향 결정
  const projectionDirection = useMemo((): ProjectionDirection => {
    if (!buildingText) return "z";
    const textWallInfo = getTextWallInfo(meshIndex, buildingStructure);
    return getProjectionDirectionFromRotation(textWallInfo.rotation[1]);
  }, [meshIndex, buildingStructure, buildingText]);

  // 기본 머티리얼 (텍스트 없을 때)
  const basicMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color,
      toneMapped: false,
    });
  }, [color]);

  // 투영 머티리얼 생성
  const projectedMaterial = useMemo(() => {
    if (!buildingText) return null;

    return createProjectedTextureMaterial({
      baseColor: color,
      boundingBox,
      projectionDirection,
    });
  }, [buildingText, color, boundingBox, projectionDirection]);

  // 텍스트 텍스처 생성 및 머티리얼 업데이트
  useEffect(() => {
    if (!buildingText || !projectedMaterial) return;

    const texture = createVerticalTextTexture({
      text: buildingText,
      color: BUILDING_CONFIG.TEXT_COLOR as string,
      maxLength: BUILDING_CONFIG.TEXT_MAX_LENGTH,
    });

    updateProjectedTexture(projectedMaterial, texture);
  }, [buildingText, projectedMaterial]);

  // 박스 구조 기반 외곽선 생성
  const edgesGeometry = useMemo(() => {
    return createBuildingEdgesGeometry(structure);
  }, [structure]);

  // 엣지 라인 머티리얼
  const edgeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: BUILDING_CONFIG.EDGE_COLOR,
      linewidth: 1,
    });
  }, []);

  // 사용할 머티리얼 결정
  const activeMaterial = projectedMaterial || basicMaterial;

  return (
    <group position={position}>
      {/* 메인 건물 메시 - 투영 텍스처 적용 */}
      <mesh geometry={geometry} material={activeMaterial} />

      {/* 외곽선 */}
      <lineSegments geometry={edgesGeometry} material={edgeMaterial} />
    </group>
  );
});
