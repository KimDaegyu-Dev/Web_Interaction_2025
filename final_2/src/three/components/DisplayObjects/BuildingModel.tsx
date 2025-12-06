import { useMemo, useEffect, memo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { createBuildingGeometry } from "../../objectSystem/buildingFactory";
import { getBuildingStructure } from "../../config/buildingPresets";
import { BUILDING_CONFIG } from "../../config/constants";
import {
  createProjectedTextureMaterial,
  updateProjectedTexture,
  updateBoundingBox,
  type ProjectionDirection,
} from "../../shaders/ProjectedTextureMaterial";
import { createVerticalTextTexture } from "../../utils/textureUtils";
import {
  createBuildingEdgesGeometry,
  calculateBoundingBox,
  calculateBoxFaceAABBs,
  calculateBoxFaceAABB,
} from "../../utils/buildingGeometry";
import { useMultiBoxAABBStore } from "@/stores/multiBoxAABBStore";
import type { BuildingStructureBox } from "@/utils/supabase";

interface BuildingModelProps {
  id: string;
  position: [number, number, number];
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  buildingText?: string | null;
  title?: string | null;
  color?: THREE.ColorRepresentation;
  isSelected?: boolean;
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
  title,
  color = BUILDING_CONFIG.DEFAULT_COLOR,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // 투영 방향 결정 (X축 또는 Z축 랜덤 선택)
  const projectionDirection = useMemo((): ProjectionDirection => {
    if (!buildingText) return "z";

    // 건물 ID를 시드로 사용하여 일관된 랜덤 선택
    let seed = 0;
    for (let i = 0; i < id.length; i++) {
      seed += id.charCodeAt(i);
    }
    const random = ((seed * 9301 + 49297) % 233280) / 233280;

    // X축 또는 Z축 랜덤 선택
    const useXAxis = random < 0.5;

    // 가장 넓은 면 찾기
    let maxArea = 0;
    let targetBox = structure[0];

    structure.forEach((box) => {
      // X축 또는 Z축 면적 계산
      const area = useXAxis
        ? box.scale[1] * box.scale[2] // YZ 평면 (X축 방향 면)
        : box.scale[0] * box.scale[1]; // XY 평면 (Z축 방향 면)
      if (area > maxArea) {
        maxArea = area;
        targetBox = box;
      }
    });

    // X축 또는 Z축 방향 선택
    if (useXAxis) {
      // X축 방향: 오른쪽 면 또는 왼쪽 면 중 선택
      // 박스의 X축 위치를 기준으로 결정 (일관성을 위해)
      return targetBox.position[0] >= 0 ? "x" : "-x";
    } else {
      // Z축 방향: 앞쪽 면 또는 뒤쪽 면 중 선택
      // 박스의 Z축 위치를 기준으로 결정 (일관성을 위해)
      return targetBox.position[2] >= 0 ? "z" : "-z";
    }
  }, [id, buildingText, structure]);

  // 다중 박스 AABB 모드 토글 상태
  const useMultiBoxAABB = useMultiBoxAABBStore((state) => state.enabled);

  // 각 박스의 면별 AABB 계산 (다중 박스 AABB 모드일 때만)
  const boxAABBs = useMemo(() => {
    if (!useMultiBoxAABB || !buildingText) return [];
    return calculateBoxFaceAABBs(structure, projectionDirection);
  }, [useMultiBoxAABB, buildingText, structure, projectionDirection]);

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
      useMultiBoxAABB,
      boxAABBs: useMultiBoxAABB ? boxAABBs : undefined,
    });
  }, [
    buildingText,
    color,
    boundingBox,
    projectionDirection,
    useMultiBoxAABB,
    boxAABBs,
  ]);

  // 외벽 텍스트 텍스처 생성 및 머티리얼 업데이트
  useEffect(() => {
    if (!buildingText || !projectedMaterial) return;

    const texture = createVerticalTextTexture({
      text: buildingText,
      color: BUILDING_CONFIG.TEXT_COLOR as string,
      maxLength: BUILDING_CONFIG.TEXT_MAX_LENGTH,
    });

    updateProjectedTexture(projectedMaterial, texture);
  }, [buildingText, projectedMaterial]);

  // 다중 박스 AABB 모드 변경 시 머티리얼 업데이트
  useEffect(() => {
    if (!projectedMaterial || !buildingText) return;

    // 바운딩 박스 업데이트 (다중 박스 AABB 모드 변경 시)
    updateBoundingBox(projectedMaterial, boundingBox);

    // 다중 박스 AABB 배열 업데이트
    if (useMultiBoxAABB && boxAABBs.length > 0) {
      const maxBoxes = 16;
      const boxAABBArray: number[] = [];
      for (let i = 0; i < maxBoxes; i++) {
        if (i < boxAABBs.length) {
          const box = boxAABBs[i];
          boxAABBArray.push(
            box.minX,
            box.maxX,
            box.minY,
            box.maxY,
            box.minZ,
            box.maxZ
          );
        } else {
          boxAABBArray.push(0, 0, 0, 0, 0, 0);
        }
      }
      // projectedMaterial.uniforms.boxAABBs.value = new Float32Array(
      // boxAABBArray
      // );
    }
    projectedMaterial.needsUpdate = true;
  }, [projectedMaterial, useMultiBoxAABB, boxAABBs, boundingBox, buildingText]);

  // 모든 상단면 박스 찾기 (같은 최대 Y 높이를 가진 박스들)
  const topFaces = useMemo(() => {
    if (!structure.length) return [];

    // 최대 Y 높이 찾기
    let maxY = -Infinity;
    structure.forEach((box) => {
      const [, py] = box.position;
      const [, sy] = box.scale;
      const boxMaxY = py + sy / 2;
      if (boxMaxY > maxY) {
        maxY = boxMaxY;
      }
    });

    // 같은 최대 Y 높이를 가진 박스들 찾기
    const topBoxes = structure.filter((box) => {
      const [, py] = box.position;
      const [, sy] = box.scale;
      const boxMaxY = py + sy / 2;
      return Math.abs(boxMaxY - maxY) < 0.001; // epsilon 비교
    });

    // X축 방향으로 정렬 (왼쪽에서 오른쪽으로)
    return topBoxes
      .map((box) => calculateBoxFaceAABB(box, "y"))
      .sort((a, b) => a.minX - b.minX); // X축 기준 정렬
  }, [structure]);

  // 텍스트를 상단면들에 분배 (줄바꿈 유지, 세로 공간 부족 시 다음 면으로)
  const titleSegments = useMemo(() => {
    if (!title || topFaces.length === 0) return [];

    // Canvas를 사용하여 텍스트 크기 측정
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];

    const lineHeight = 1.2;

    const segments: Array<{
      text: string;
      aabb: (typeof topFaces)[0];
    }> = [];

    let remainingText = title;
    let currentFaceIndex = 0;

    while (remainingText.length > 0 && currentFaceIndex < topFaces.length) {
      const face = topFaces[currentFaceIndex];
      const maxWidth = face.maxX - face.minX;
      const maxHeight = face.maxZ - face.minZ; // Z축이 세로 방향
      const fontSize = (face.maxZ - face.minZ) * 0.2;

      ctx.font = `bold ${fontSize}px sans-serif`;

      // 줄바꿈을 고려하여 텍스트 분할
      const words = remainingText.split("");
      const lines: string[] = [];
      let currentLine = "";
      let totalHeight = 0;
      const lineHeightPx = fontSize * lineHeight;

      for (let i = 0; i < words.length; i++) {
        const char = words[i];
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== "") {
          // 줄바꿈
          lines.push(currentLine);
          totalHeight += lineHeightPx;

          // 높이가 면의 높이를 넘어가면 이 면에서 중단
          if (totalHeight + lineHeightPx > maxHeight) {
            break;
          }

          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      // 마지막 줄 추가 (높이 체크)
      if (currentLine && totalHeight + lineHeightPx <= maxHeight) {
        lines.push(currentLine);
        totalHeight += lineHeightPx;
      }

      if (lines.length > 0) {
        const textForThisFace = lines.join("\n");
        segments.push({
          text: textForThisFace,
          aabb: face,
        });

        // 사용한 텍스트 길이 계산
        const usedLength = textForThisFace.replace(/\n/g, "").length;
        remainingText = remainingText.slice(usedLength);
      }

      currentFaceIndex++;
    }

    return segments;
  }, [title, topFaces]);

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
      {/* 메인 건물 메시 - 외벽 텍스트 투영 */}
      <mesh geometry={geometry} material={activeMaterial} />

      {/* 상단면들에 title 표시 (troika-text 사용, 여러 면에 분배) */}
      {titleSegments.map((segment, index) => {
        const fontSize = (segment.aabb.maxZ - segment.aabb.minZ) * 0.2;
        return (
          <Text
            key={index}
            position={[
              segment.aabb.minX, // 왼쪽 모서리
              segment.aabb.maxY + 0.01, // 상단면 위
              segment.aabb.minZ, // 앞쪽 모서리
            ]}
            rotation={[-Math.PI / 2, 0, 0]} // 수평 평면에 배치
            fontSize={fontSize}
            maxWidth={segment.aabb.maxX - segment.aabb.minX} // 상단면 너비(X축)를 최대 너비로
            color={BUILDING_CONFIG.TEXT_COLOR as string}
            anchorX="left"
            anchorY="top"
            textAlign="left"
            lineHeight={1.2}
            overflowWrap="break-word"
          >
            {segment.text}
          </Text>
        );
      })}

      {/* 외곽선 */}
      <lineSegments geometry={edgesGeometry} material={edgeMaterial} />
    </group>
  );
});
