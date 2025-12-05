import { useMemo, useRef, useEffect, memo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
// @ts-ignore - troika-three-text 타입 정의 없음
import { Text } from "troika-three-text";
import { createBuildingGeometry, getTextWallInfo } from "../../objectSystem/buildingFactory";
import { getBuildingStructure } from "../../config/buildingPresets";
import { BUILDING_CONFIG } from "../../config/constants";
import type { BuildingStructureBox } from "@/utils/supabase";

// 부동소수점 비교용 epsilon
const EPSILON = 0.001;

// ...existing code... (isPointInsideBox, isEdgeInsideBox, createBoxEdges, createBuildingEdgesGeometry 함수들)

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
  
  const v = [
    new THREE.Vector3(px - hw, py - hh, pz - hd),
    new THREE.Vector3(px + hw, py - hh, pz - hd),
    new THREE.Vector3(px + hw, py - hh, pz + hd),
    new THREE.Vector3(px - hw, py - hh, pz + hd),
    new THREE.Vector3(px - hw, py + hh, pz - hd),
    new THREE.Vector3(px + hw, py + hh, pz - hd),
    new THREE.Vector3(px + hw, py + hh, pz + hd),
    new THREE.Vector3(px - hw, py + hh, pz + hd),
  ];
  
  return [
    [v[0], v[1]], [v[1], v[2]], [v[2], v[3]], [v[3], v[0]],
    [v[4], v[5]], [v[5], v[6]], [v[6], v[7]], [v[7], v[4]],
    [v[0], v[4]], [v[1], v[5]], [v[2], v[6]], [v[3], v[7]],
  ];
}

/**
 * 여러 박스의 외곽 엣지를 합쳐서 BufferGeometry 생성
 */
function createBuildingEdgesGeometry(structure: BuildingStructureBox[]): THREE.BufferGeometry {
  const visibleEdges: THREE.Vector3[] = [];
  
  structure.forEach((box, boxIndex) => {
    const edges = createBoxEdges(box);
    
    edges.forEach(([p1, p2]) => {
      let isHidden = false;
      
      for (let i = 0; i < structure.length; i++) {
        if (i === boxIndex) continue;
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

/**
 * Troika Text를 텍스처로 렌더링
 */
function createTextTexture(
  text: string,
  renderer: THREE.WebGLRenderer,
  options: {
    fontSize?: number;
    color?: string;
    width?: number;
    height?: number;
  } = {}
): Promise<THREE.Texture> {
  const {
    fontSize = 64,
    color = "#000000",
    width = 256,
    height = 512,
  } = options;

  return new Promise((resolve) => {
    // 오프스크린 씬 & 카메라
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2,
      height / 2, -height / 2,
      0.1, 100
    );
    camera.position.z = 10;

    // Troika Text 생성
    const troikaText = new Text();
    const verticalText = text.split("").join("\n");
    
    troikaText.text = verticalText;
    troikaText.fontSize = fontSize;
    troikaText.color = color;
    troikaText.anchorX = "center";
    troikaText.anchorY = "middle";
    troikaText.textAlign = "center";
    troikaText.lineHeight = 1.2;
    
    scene.add(troikaText);

    // 렌더 타겟
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });

    // 텍스트 동기화 후 렌더링
    troikaText.sync(() => {
      const originalRenderTarget = renderer.getRenderTarget();
      
      renderer.setRenderTarget(renderTarget);
      renderer.setClearColor(0xffffff, 0); // 투명 배경
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(originalRenderTarget);

      // 클린업
      troikaText.dispose();
      scene.remove(troikaText);

      resolve(renderTarget.texture);
    });
  });
}

/**
 * 투영 머티리얼용 커스텀 셰이더
 * - 건물 로컬 좌표 기반 직접 UV 매핑
 */
function createProjectedTextMaterial(
  baseColor: THREE.ColorRepresentation,
  textTexture: THREE.Texture | null,
  boundingBox: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number },
  projectionDirection: "x" | "-x" | "z" | "-z"
): THREE.ShaderMaterial {
  // 투영 방향에 따른 축 설정
  const isXAxis = projectionDirection === "x" || projectionDirection === "-x";
  const sign = projectionDirection === "x" || projectionDirection === "z" ? 1.0 : -1.0;

  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color(baseColor) },
      textTexture: { value: textTexture },
      hasTexture: { value: false }, // useEffect에서 텍스처 설정 후 true로 변경
      // 바운딩 박스 정보
      bboxMin: { value: new THREE.Vector3(boundingBox.minX, boundingBox.minY, boundingBox.minZ) },
      bboxMax: { value: new THREE.Vector3(boundingBox.maxX, boundingBox.maxY, boundingBox.maxZ) },
      projectionAxis: { value: isXAxis ? 0 : 2 }, // 0 = x축 투영, 2 = z축 투영
      projectionSign: { value: sign },
    },
    vertexShader: `
      varying vec3 vLocalPosition;
      varying vec3 vLocalNormal;
      
      void main() {
        vLocalPosition = position; // 로컬 좌표 사용
        vLocalNormal = normal;     // 로컬 법선 사용
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform sampler2D textTexture;
      uniform bool hasTexture;
      uniform vec3 bboxMin;
      uniform vec3 bboxMax;
      uniform int projectionAxis; // 0 = x, 2 = z
      uniform float projectionSign;
      
      varying vec3 vLocalPosition;
      varying vec3 vLocalNormal;
      
      void main() {
        vec3 color = baseColor;
        
        if (hasTexture) {
          vec2 uv;
          float normalCheck;
          
          if (projectionAxis == 0) {
            // X축 방향 투영: Z와 Y로 UV 계산
            uv.x = (vLocalPosition.z - bboxMin.z) / (bboxMax.z - bboxMin.z);
            uv.y = (vLocalPosition.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
            normalCheck = vLocalNormal.x * projectionSign;
          } else {
            // Z축 방향 투영: X와 Y로 UV 계산
            uv.x = (vLocalPosition.x - bboxMin.x) / (bboxMax.x - bboxMin.x);
            uv.y = (vLocalPosition.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
            normalCheck = vLocalNormal.z * projectionSign;
          }
          
          // 디버그: UV를 색상으로 표시 (빨강=U, 초록=V)
          // color = vec3(uv.x, uv.y, 0.0);
          
          // 디버그: 법선 체크 시각화 (파랑 = 투영 방향 면)
          // if (normalCheck > 0.5) color = vec3(0.0, 0.0, 1.0);
          
          // UV 범위 체크 및 법선 체크 (투영 방향 면에만 적용)
          if (normalCheck > 0.5 && uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
            vec4 texColor = texture2D(textTexture, uv);
            // 텍스트 부분만 색상 적용 (알파가 있으면 텍스트)
            if (texColor.a > 0.1) {
              color = texColor.rgb;
            }
          }
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * 건물 구조에서 바운딩 박스 계산
 */
function calculateBoundingBox(structure: BuildingStructureBox[]) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  structure.forEach((box) => {
    const [px, py, pz] = box.position;
    const [sx, sy, sz] = box.scale;
    
    minX = Math.min(minX, px - sx / 2);
    maxX = Math.max(maxX, px + sx / 2);
    minY = Math.min(minY, py - sy / 2);
    maxY = Math.max(maxY, py + sy / 2);
    minZ = Math.min(minZ, pz - sz / 2);
    maxZ = Math.max(maxZ, pz + sz / 2);
  });

  return { minX, maxX, minY, maxY, minZ, maxZ };
}

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
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { gl: renderer } = useThree(); // React Three Fiber에서 renderer 가져오기

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

  // 텍스트 벽 정보에서 투영 방향 결정
  const textWallInfo = useMemo(() => {
    if (!buildingText) return null;
    return getTextWallInfo(meshIndex, buildingStructure);
  }, [meshIndex, buildingStructure, buildingText]);

  // 투영 방향 결정
  const projectionDirection = useMemo((): "x" | "-x" | "z" | "-z" => {
    if (!textWallInfo) return "z";
    const ry = textWallInfo.rotation[1];
    
    // ry = 0: +Z 방향, ry = Math.PI/2: +X 방향, etc.
    if (Math.abs(ry) < 0.1) return "z";
    if (Math.abs(ry - Math.PI / 2) < 0.1) return "x";
    if (Math.abs(ry - Math.PI) < 0.1 || Math.abs(ry + Math.PI) < 0.1) return "-z";
    if (Math.abs(ry + Math.PI / 2) < 0.1) return "-x";
    return "z";
  }, [textWallInfo]);

  // 바운딩 박스 계산
  const boundingBox = useMemo(() => {
    return calculateBoundingBox(structure);
  }, [structure]);

  // 기본 머티리얼 (텍스트 없을 때)
  const basicMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color,
      toneMapped: false,
    });
  }, [color]);

  // 투영 머티리얼 생성 (텍스트 텍스처 없이 초기화)
  const projectedMaterial = useMemo(() => {
    if (!buildingText) {
      console.log("buildingText 없음, basicMaterial 사용");
      return null;
    }
    
    console.log("projectedMaterial 생성:", buildingText, boundingBox);
    const mat = createProjectedTextMaterial(
      color,
      null, // 텍스처는 나중에 설정
      boundingBox,
      projectionDirection
    );
    materialRef.current = mat;
    return mat;
  }, [buildingText, color, boundingBox, projectionDirection]);

  // 텍스트 텍스처 생성 및 머티리얼 업데이트
  useEffect(() => {
    if (!buildingText || !projectedMaterial) {
      console.log("텍스처 생성 스킵:", { buildingText, hasMaterial: !!projectedMaterial });
      return;
    }

    // Canvas2D로 텍스처 생성
    // 텍스처 레이아웃: 오른쪽에서 왼쪽으로 열(세로줄)이 배치됨
    // 각 열은 위에서 아래로 글자가 배치됨
    const canvas2d = document.createElement("canvas");
    const scale = 1; // 레티나 디스플레이 대응
    const canvasWidth = 512;  // 여러 열을 위해 넓게
    const canvasHeight = 512;
    canvas2d.width = canvasWidth;
    canvas2d.height = canvasHeight;
    const ctx = canvas2d.getContext("2d");
    
    if (ctx) {
      // 안티앨리어싱 활성화
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      // 투명 배경
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.fillStyle = BUILDING_CONFIG.TEXT_COLOR as string;
      ctx.font = `bold ${56 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // 세로쓰기: 오른쪽 위에서 시작, 왼쪽으로 열 이동
      const text = buildingText.slice(0, BUILDING_CONFIG.TEXT_MAX_LENGTH);
      const charHeight = 64 * scale;  // 글자 세로 간격
      const columnWidth = 70 * scale; // 열 간격
      const maxCharsPerColumn = Math.floor((canvasHeight - 40 * scale) / charHeight);
      
      // 텍스트를 열 단위로 분리
      const columns: string[] = [];
      for (let i = 0; i < text.length; i += maxCharsPerColumn) {
        columns.push(text.slice(i, i + maxCharsPerColumn));
      }
      
      // 텍스처 오른쪽 위에서 시작 → 건물 오른쪽 위에 매핑
      const startX = canvasWidth - columnWidth / 2 - 20 * scale; // 오른쪽에서 시작
      const startY = 40 * scale; // 위쪽에서 시작
      
      columns.forEach((column, colIndex) => {
        const x = startX - colIndex * columnWidth; // 왼쪽으로 이동
        column.split("").forEach((char, charIndex) => {
          const y = startY + charIndex * charHeight + charHeight / 2; // 아래로 이동
          ctx.fillText(char, x, y);
        });
      });
      
      const texture = new THREE.CanvasTexture(canvas2d);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false; // 깨끗한 텍스트를 위해
      texture.needsUpdate = true;
      
      // projectedMaterial의 uniforms 직접 업데이트
      projectedMaterial.uniforms.textTexture.value = texture;
      projectedMaterial.uniforms.hasTexture.value = true;
      projectedMaterial.needsUpdate = true;
      
      console.log("텍스트 텍스처 생성 완료:", buildingText);
    }
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
    <group ref={groupRef} position={position}>
      {/* 메인 건물 메시 - 투영 텍스처 적용 */}
      <mesh geometry={geometry} material={activeMaterial} />

      {/* 외곽선 */}
      <lineSegments geometry={edgesGeometry} material={edgeMaterial} />
    </group>
  );
});