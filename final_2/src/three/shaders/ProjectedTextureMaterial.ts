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
  } = options;

  const { axis, sign } = getProjectionAxisInfo(projectionDirection);

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
      
      varying vec3 vLocalPosition;
      varying vec3 vLocalNormal;
      
      void main() {
        vec3 color = baseColor;
        
        if (hasTexture) {
          vec2 uv;
          float normalCheck;
          
          // 투영 축에 따라 UV 계산
          if (projectionAxis == 0) {
            // X축 방향 투영: Z와 Y로 UV 계산
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
            uv.x = (vLocalPosition.x - bboxMin.x) / (bboxMax.x - bboxMin.x);
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
