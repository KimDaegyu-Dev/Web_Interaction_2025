import * as THREE from "three";
import { GRID_CONFIG } from "../config/grid";

/**
 * NDC 좌표를 월드 좌표의 Ray로 변환
 */
export function ndcToRay(
  ndcX: number,
  ndcY: number,
  camera: THREE.Camera,
): THREE.Ray {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  return raycaster.ray;
}

/**
 * Ray를 Oblique 투영 행렬의 역변환을 사용하여 원본 좌표계로 변환
 */
export function transformRayToOriginalSpace(
  ray: THREE.Ray,
  inverseObliqueMatrix: THREE.Matrix4,
): { origin: THREE.Vector3; direction: THREE.Vector3 } {
  const originalRayOrigin = ray.origin
    .clone()
    .applyMatrix4(inverseObliqueMatrix);
  const originalRayDirection = ray.direction
    .clone()
    .transformDirection(inverseObliqueMatrix)
    .normalize();

  return {
    origin: originalRayOrigin,
    direction: originalRayDirection,
  };
}

/**
 * Ray와 바닥 평면의 교점 계산
 * backface culling 문제를 피하기 위해 수동으로 계산
 */
export function intersectRayWithFloorPlane(
  rayOrigin: THREE.Vector3,
  rayDirection: THREE.Vector3,
): THREE.Vector3 | null {
  const floorY = GRID_CONFIG.FLOOR_LEVEL;
  const planeNormal = new THREE.Vector3(0, 1, 0);
  const planePoint = new THREE.Vector3(0, floorY, 0);

  const denom = rayDirection.dot(planeNormal);

  if (Math.abs(denom) < 1e-6) {
    // Ray와 평면이 평행함
    return null;
  }

  // 교점 계산
  const toPlane = planePoint.clone().sub(rayOrigin);
  const t = toPlane.dot(planeNormal) / denom;

  const intersectPoint = rayOrigin.clone().addScaledVector(rayDirection, t);

  // 교점이 평면에 충분히 가까운지 확인
  const distanceToPlane = Math.abs(
    intersectPoint.clone().sub(planePoint).dot(planeNormal),
  );

  if (distanceToPlane < 0.1) {
    return intersectPoint;
  }

  return null;
}

/**
 * 월드 좌표를 그리드 좌표로 변환
 */
export function worldToGridCoords(
  worldPoint: THREE.Vector3,
  gridSize: number = GRID_CONFIG.CELL_SIZE,
): { x: number; z: number } {
  const snappedX = Math.round(worldPoint.x / gridSize) * gridSize;
  const snappedZ = Math.round(worldPoint.z / gridSize) * gridSize;
  return { x: snappedX, z: snappedZ };
}

/**
 * 스크린 좌표를 그리드 좌표로 변환
 */
export function screenToGridCoords(
  screenX: number,
  screenY: number,
  camera: THREE.Camera,
  gl: { domElement: HTMLElement },
  inverseObliqueMatrix: THREE.Matrix4,
): { x: number; z: number } | null {
  // 정규화된 디바이스 좌표로 변환
  const rect = gl.domElement.getBoundingClientRect();
  const ndcX = ((screenX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -((screenY - rect.top) / rect.height) * 2 + 1;

  // Ray 생성
  const ray = ndcToRay(ndcX, ndcY, camera);

  // Ray를 원본 좌표계로 변환
  const { origin, direction } = transformRayToOriginalSpace(
    ray,
    inverseObliqueMatrix,
  );

  // 바닥 평면과의 교점 계산
  const intersectPoint = intersectRayWithFloorPlane(origin, direction);

  if (!intersectPoint) {
    return null;
  }

  // 그리드 좌표로 변환
  return worldToGridCoords(intersectPoint);
}
