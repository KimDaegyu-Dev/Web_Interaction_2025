import * as THREE from "three";

/**
 * 투영 방향 타입
 * x, -x: X축 방향 투영
 * y, -y: Y축 방향 투영 (위/아래)
 * z, -z: Z축 방향 투영
 */
export type ProjectionDirection = "x" | "-x" | "y" | "-y" | "z" | "-z";

/**
 * 바운딩 박스 타입
 */
export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

/**
 * 투영 머티리얼 옵션
 */
export interface ProjectedMaterialOptions {
  baseColor: THREE.ColorRepresentation;
  texture?: THREE.Texture | null;
  boundingBox: BoundingBox;
  projectionDirection: ProjectionDirection;
  /** 법선 체크 임계값 (기본: 0.5) */
  normalThreshold?: number;
  /** 알파 임계값 (기본: 0.1) */
  alphaThreshold?: number;
  /** 다중 박스 AABB 모드 활성화 */
  useMultiBoxAABB?: boolean;
  /** 각 박스의 면별 AABB 배열 (useMultiBoxAABB가 true일 때 사용) */
  boxAABBs?: BoundingBox[];
}

/**
 * 투영 축 정보 계산
 */
function getProjectionAxisInfo(direction: ProjectionDirection): {
  axis: number; // 0 = x, 1 = y, 2 = z
  sign: number;
} {
  switch (direction) {
    case "x":
      return { axis: 0, sign: 1 };
    case "-x":
      return { axis: 0, sign: -1 };
    case "y":
      return { axis: 1, sign: 1 };
    case "-y":
      return { axis: 1, sign: -1 };
    case "z":
      return { axis: 2, sign: 1 };
    case "-z":
      return { axis: 2, sign: -1 };
  }
}

/**
 * 투영 텍스처 머티리얼 생성
 *
 * 로컬 좌표 기반으로 텍스처를 특정 방향에서 투영합니다.
 * Y축 투영: 위/아래에서 투영 (바닥/천장)
 * X축 투영: 좌/우에서 투영 (측면)
 * Z축 투영: 앞/뒤에서 투영 (정면)
 */
export function createProjectedTextureMaterial(
  options: ProjectedMaterialOptions
): THREE.ShaderMaterial {
  const {
    baseColor,
    texture = null,
    boundingBox,
    projectionDirection,
    normalThreshold = 0.5,
    alphaThreshold = 0.1,
    useMultiBoxAABB = false,
    boxAABBs = [],
  } = options;

  const { axis, sign } = getProjectionAxisInfo(projectionDirection);

  // 다중 박스 AABB를 위한 배열 준비 (최대 16개 박스 지원)
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
      // 빈 슬롯은 0으로 채움
      boxAABBArray.push(0, 0, 0, 0, 0, 0);
    }
  }

  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color(baseColor) },
      projectedTexture: { value: texture },
      hasTexture: { value: texture !== null },
      bboxMin: {
        value: new THREE.Vector3(
          boundingBox.minX,
          boundingBox.minY,
          boundingBox.minZ
        ),
      },
      bboxMax: {
        value: new THREE.Vector3(
          boundingBox.maxX,
          boundingBox.maxY,
          boundingBox.maxZ
        ),
      },
      projectionAxis: { value: axis },
      projectionSign: { value: sign },
      normalThreshold: { value: normalThreshold },
      alphaThreshold: { value: alphaThreshold },
      useMultiBoxAABB: { value: useMultiBoxAABB },
      boxAABBs: { value: new Float32Array(boxAABBArray) },
      boxCount: { value: useMultiBoxAABB ? boxAABBs.length : 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocalPosition;
      varying vec3 vLocalNormal;
      
      void main() {
        vLocalPosition = position;
        vLocalNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 baseColor;
      uniform sampler2D projectedTexture;
      uniform bool hasTexture;
      uniform vec3 bboxMin;
      uniform vec3 bboxMax;
      uniform int projectionAxis; // 0 = x, 1 = y, 2 = z
      uniform float projectionSign;
      uniform float normalThreshold;
      uniform float alphaThreshold;
      uniform bool useMultiBoxAABB;
      uniform float boxAABBs[96]; // 16개 박스 × 6개 값 (minX, maxX, minY, maxY, minZ, maxZ)
      uniform int boxCount;
      
      varying vec3 vLocalPosition;
      varying vec3 vLocalNormal;
      
      // 점이 AABB 내부에 있는지 확인
      bool isPointInAABB(vec3 pos, vec3 min, vec3 max) {
        return pos.x >= min.x && pos.x <= max.x &&
               pos.y >= min.y && pos.y <= max.y &&
               pos.z >= min.z && pos.z <= max.z;
      }
      
      // 박스 AABB에서 UV 계산
      vec2 calculateUVFromBoxAABB(vec3 pos, vec3 min, vec3 max, int axis) {
        vec2 uv;
        if (axis == 0) {
          // X축 방향 투영: Z와 Y로 UV 계산
          uv.x = 1.0 - (pos.z - min.z) / (max.z - min.z); // X축 반전
          uv.y = (pos.y - min.y) / (max.y - min.y);
        } else if (axis == 1) {
          // Y축 방향 투영: X와 Z로 UV 계산
          uv.x = (pos.x - min.x) / (max.x - min.x);
          uv.y = (pos.z - min.z) / (max.z - min.z);
        } else {
          // Z축 방향 투영: X와 Y로 UV 계산
          uv.x = (pos.x - min.x) / (max.x - min.x);
          uv.y = (pos.y - min.y) / (max.y - min.y);
        }
        return uv;
      }
      
      void main() {
        vec3 color = baseColor;
        
        if (hasTexture) {
          vec2 uv;
          float normalCheck;
          bool foundBox = false;
          
          // 다중 박스 AABB 모드
          if (useMultiBoxAABB && boxCount > 0) {
            // 각 박스의 AABB를 확인하여 해당 박스에 속하는지 체크
            for (int i = 0; i < 16; i++) {
              if (i >= boxCount) break;
              
              int idx = i * 6;
              vec3 boxMin = vec3(boxAABBs[idx], boxAABBs[idx + 2], boxAABBs[idx + 4]);
              vec3 boxMax = vec3(boxAABBs[idx + 1], boxAABBs[idx + 3], boxAABBs[idx + 5]);
              
              // 법선 체크
              if (projectionAxis == 0) {
                normalCheck = vLocalNormal.x * projectionSign;
              } else if (projectionAxis == 1) {
                normalCheck = vLocalNormal.y * projectionSign;
              } else {
                normalCheck = vLocalNormal.z * projectionSign;
              }
              
              // 해당 박스의 AABB 내부이고 법선이 맞는 경우
              if (normalCheck > normalThreshold && isPointInAABB(vLocalPosition, boxMin, boxMax)) {
                uv = calculateUVFromBoxAABB(vLocalPosition, boxMin, boxMax, projectionAxis);
                
                // UV 범위 체크
                if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
                  vec4 texColor = texture2D(projectedTexture, uv);
                  if (texColor.a > alphaThreshold) {
                    color = texColor.rgb;
                    foundBox = true;
                    break;
                  }
                }
              }
            }
          } else {
            // 기존 단일 AABB 모드
          // 투영 축에 따라 UV 계산
          if (projectionAxis == 0) {
            // X축 방향 투영: Z와 Y로 UV 계산
            // X축과 Z축에서 repeat 반대: X축은 정상, Z축은 X축 반전
            uv.x = (vLocalPosition.z - bboxMin.z) / (bboxMax.z - bboxMin.z);
            uv.y = (vLocalPosition.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
            normalCheck = vLocalNormal.x * projectionSign;
          } else if (projectionAxis == 1) {
            // Y축 방향 투영: X와 Z로 UV 계산
            uv.x = (vLocalPosition.x - bboxMin.x) / (bboxMax.x - bboxMin.x);
            uv.y = (vLocalPosition.z - bboxMin.z) / (bboxMax.z - bboxMin.z);
            normalCheck = vLocalNormal.y * projectionSign;
          } else {
            // Z축 방향 투영: X와 Y로 UV 계산
            // X축과 Z축에서 repeat 반대: Z축은 X축 반전
            uv.x = 1.0 - (vLocalPosition.x - bboxMin.x) / (bboxMax.x - bboxMin.x); // X축 반전
            uv.y = (vLocalPosition.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
            normalCheck = vLocalNormal.z * projectionSign;
          }
          
          // UV 범위 체크 및 법선 체크 (투영 방향 면에만 적용)
          if (normalCheck > normalThreshold && 
              uv.x >= 0.0 && uv.x <= 1.0 && 
              uv.y >= 0.0 && uv.y <= 1.0) {
            vec4 texColor = texture2D(projectedTexture, uv);
            // 알파 임계값 이상인 부분만 색상 적용
            if (texColor.a > alphaThreshold) {
              color = texColor.rgb;
              }
            }
          }
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * 투영 머티리얼의 텍스처 업데이트
 */
export function updateProjectedTexture(
  material: THREE.ShaderMaterial,
  texture: THREE.Texture
): void {
  material.uniforms.projectedTexture.value = texture;
  material.uniforms.hasTexture.value = true;
  material.needsUpdate = true;
}

/**
 * 투영 머티리얼의 바운딩 박스 업데이트
 */
export function updateBoundingBox(
  material: THREE.ShaderMaterial,
  boundingBox: BoundingBox
): void {
  material.uniforms.bboxMin.value.set(
    boundingBox.minX,
    boundingBox.minY,
    boundingBox.minZ
  );
  material.uniforms.bboxMax.value.set(
    boundingBox.maxX,
    boundingBox.maxY,
    boundingBox.maxZ
  );
  material.needsUpdate = true;
}
