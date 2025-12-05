import { useMemo, useRef, useEffect, memo } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
// @ts-ignore - troika-three-text 타입 정의 없음
import { Text } from "troika-three-text";
import { createBuildingGeometry, getTextWallInfo } from "../../objectSystem/buildingFactory";
import { getBuildingStructure } from "../../config/buildingPresets";
import { BUILDING_CONFIG } from "../../config/constants";
import type { BuildingStructureBox } from "@/utils/supabase";

// 부동소수점 비교용 epsilon
const EPSILON = 0.001;

/**
 * 점이 박스 내부에 있는지 확인 (경계 포함)
 */
function isPointInsideBox(point: THREE.Vector3, box: BuildingStructureBox): boolean {
  const [px, py, pz] = box.position;
  const [sx, sy, sz] = box.scale;
  
  const minX = px - sx / 2 - EPSILON;
  const maxX = px + sx / 2 + EPSILON;
  const minY = py - sy / 2 - EPSILON;
  const maxY = py + sy / 2 + EPSILON;
  const minZ = pz - sz / 2 - EPSILON;
  const maxZ = pz + sz / 2 + EPSILON;
  
  return (
    point.x >= minX && point.x <= maxX &&
    point.y >= minY && point.y <= maxY &&
    point.z >= minZ && point.z <= maxZ
  );
}

/**
 * 엣지(선분)가 박스 내부에 완전히 포함되어 있는지 확인
 * 두 끝점과 중점이 모두 박스 내부에 있어야 함
 */
function isEdgeInsideBox(p1: THREE.Vector3, p2: THREE.Vector3, box: BuildingStructureBox): boolean {
  const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  return isPointInsideBox(p1, box) && isPointInsideBox(p2, box) && isPointInsideBox(midPoint, box);
}

/**
 * 박스의 12개 외곽 엣지 생성
 */
function createBoxEdges(box: BuildingStructureBox): Array<[THREE.Vector3, THREE.Vector3]> {
  const [px, py, pz] = box.position;
  const [sx, sy, sz] = box.scale;
  
  const hw = sx / 2;
  const hh = sy / 2;
  const hd = sz / 2;
  
  // 8개 꼭짓점
  const v = [
    new THREE.Vector3(px - hw, py - hh, pz - hd), // 0: 좌하후
    new THREE.Vector3(px + hw, py - hh, pz - hd), // 1: 우하후
    new THREE.Vector3(px + hw, py - hh, pz + hd), // 2: 우하전
    new THREE.Vector3(px - hw, py - hh, pz + hd), // 3: 좌하전
    new THREE.Vector3(px - hw, py + hh, pz - hd), // 4: 좌상후
    new THREE.Vector3(px + hw, py + hh, pz - hd), // 5: 우상후
    new THREE.Vector3(px + hw, py + hh, pz + hd), // 6: 우상전
    new THREE.Vector3(px - hw, py + hh, pz + hd), // 7: 좌상전
  ];
  
  // 12개 엣지 (시작점, 끝점)
  return [
    // 하단 사각형
    [v[0], v[1]], [v[1], v[2]], [v[2], v[3]], [v[3], v[0]],
    // 상단 사각형
    [v[4], v[5]], [v[5], v[6]], [v[6], v[7]], [v[7], v[4]],
    // 수직 엣지 4개
    [v[0], v[4]], [v[1], v[5]], [v[2], v[6]], [v[3], v[7]],
  ];
}

/**
 * 여러 박스의 외곽 엣지를 합쳐서 BufferGeometry 생성
 * 다른 박스 내부에 완전히 숨겨진 엣지는 제거
 */
function createBuildingEdgesGeometry(structure: BuildingStructureBox[]): THREE.BufferGeometry {
  const visibleEdges: THREE.Vector3[] = [];
  
  structure.forEach((box, boxIndex) => {
    const edges = createBoxEdges(box);
    
    edges.forEach(([p1, p2]) => {
      // 이 엣지가 다른 박스 내부에 완전히 포함되어 있는지 확인
      let isHidden = false;
      
      for (let i = 0; i < structure.length; i++) {
        if (i === boxIndex) continue; // 자기 자신은 제외
        
        if (isEdgeInsideBox(p1, p2, structure[i])) {
          isHidden = true;
          break;
        }
      }
      
      if (!isHidden) {
        visibleEdges.push(p1, p2);
      }
    });
  });
  
  // Float32Array로 변환
  const positions = new Float32Array(visibleEdges.length * 3);
  visibleEdges.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  });
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  
  return geometry;
}

interface BuildingModelProps {
  id: string;
  position: [number, number, number];
  meshIndex: number;
  buildingStructure?: BuildingStructureBox[] | null;
  buildingText?: string | null;
  color?: THREE.ColorRepresentation;
  onClick?: (e: ThreeEvent<MouseEvent>, id: string) => void;
  isSelected?: boolean;
}

/**
 * CSG 기반 건물 모델 컴포넌트
 * - 흰색 건물에 검은 엣지 라인
 * - Troika Text로 외벽에 세로 텍스트 렌더링
 */
export const BuildingModel = memo(function BuildingModel({
  id,
  position,
  meshIndex,
  buildingStructure,
  buildingText,
  color = BUILDING_CONFIG.DEFAULT_COLOR,
  onClick,
  isSelected = false,
}: BuildingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<Text | null>(null);

  // CSG 지오메트리 생성 (캐시 활용)
  const geometry = useMemo(() => {
    return createBuildingGeometry(meshIndex, buildingStructure);
  }, [meshIndex, buildingStructure]);

  // 머티리얼 생성 (흰색 건물)
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.0,
      flatShading: true,
    });
  }, [color]);

  // 선택 시 아웃라인 효과용 머티리얼
  const outlineMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      side: THREE.BackSide,
    });
  }, []);

  // 박스 구조 기반 외곽선 생성 (EdgesGeometry 대신 직접 계산)
  // CSG 내부 삼각형 분할과 무관하게 깔끔한 박스 엣지만 렌더링
  const edgesGeometry = useMemo(() => {
    const structure = buildingStructure?.length
      ? buildingStructure
      : getBuildingStructure(meshIndex);
    return createBuildingEdgesGeometry(structure);
  }, [meshIndex, buildingStructure]);

  // 엣지 라인 머티리얼
  const edgeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: BUILDING_CONFIG.EDGE_COLOR,
      linewidth: 1,
    });
  }, []);

  // 텍스트 벽 정보 계산
  const textWallInfo = useMemo(() => {
    if (!buildingText) return null;
    return getTextWallInfo(meshIndex, buildingStructure);
  }, [meshIndex, buildingStructure, buildingText]);

  // Troika Text 초기화 및 업데이트 (세로 텍스트)
  useEffect(() => {
    if (!buildingText || !textWallInfo || !groupRef.current) return;

    // 기존 텍스트 제거
    if (textRef.current) {
      groupRef.current.remove(textRef.current);
      textRef.current.dispose();
    }

    // 새 텍스트 생성
    const text = new Text();
    
    // 세로 배치를 위해 글자 사이에 줄바꿈 추가
    const verticalText = buildingText
      .slice(0, BUILDING_CONFIG.TEXT_MAX_LENGTH)
      .split("")
      .join("\n");
    
    text.text = verticalText;
    text.fontSize = BUILDING_CONFIG.TEXT_SIZE;
    text.color = BUILDING_CONFIG.TEXT_COLOR;
    text.anchorX = "center";
    text.anchorY = "middle";
    text.textAlign = "center";
    text.lineHeight = 1.2;
    text.font = undefined; // 시스템 기본 폰트 사용

    // 텍스트 위치 설정
    text.position.set(...textWallInfo.position);
    text.rotation.set(...textWallInfo.rotation);

    // 텍스트 동기화
    text.sync();

    textRef.current = text;
    groupRef.current.add(text);

    return () => {
      if (textRef.current) {
        textRef.current.dispose();
      }
    };
  }, [buildingText, textWallInfo]);

  // 클릭 핸들러
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(e, id);
  };

  return (
    <group ref={groupRef} position={position}>
      {/* 메인 건물 메시 (흰색) */}
      <mesh
        geometry={geometry}
        material={material}
        onClick={handleClick}
      />

      {/* 외곽선 (박스 구조 기반 직접 계산된 엣지) */}
      <lineSegments geometry={edgesGeometry} material={edgeMaterial} />

      {/* 선택 시 아웃라인 효과 */}
      {isSelected && (
        <mesh
          geometry={geometry}
          material={outlineMaterial}
          scale={[1.02, 1.02, 1.02]}
        />
      )}
    </group>
  );
});
