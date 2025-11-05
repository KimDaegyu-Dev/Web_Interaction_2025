import * as THREE from 'three';
import type { ProjectionParams } from '../config/types';

// Oblique 투영 행렬 설정
export function calculateObliqueMatrix(
  params: ProjectionParams,
  panOffset = new THREE.Vector3(0, 0, 0)
): THREE.Matrix4 {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const sx = params.scaleX;
  const sy = params.scaleY;
  const sz = params.scaleZ;

  const rx = toRad(params.thetaX);
  const ry = toRad(params.thetaY);
  const rz = toRad(params.thetaZ);

  const xVec = new THREE.Vector3(Math.cos(rx) * sx, Math.sin(rx) * sx, 0);
  const yVec = new THREE.Vector3(Math.cos(ry) * sy, Math.sin(ry) * sy, 0);
  const zVec = new THREE.Vector3(Math.cos(rz) * sz, Math.sin(rz) * sz, 0);

  const mat = new THREE.Matrix4();
  mat.set(
    xVec.x,
    yVec.x,
    zVec.x,
    panOffset.x,
    xVec.y,
    yVec.y,
    zVec.y,
    panOffset.y,
    0,
    0,
    1,
    panOffset.z,
    0,
    0,
    0,
    1
  );

  return mat;
}

// Group에 Oblique 투영 적용
export function applyObliqueProjection(
  group: THREE.Group,
  matrix: THREE.Matrix4
): void {
  group.matrixAutoUpdate = false;
  group.matrix.copy(matrix);
  group.matrixWorldNeedsUpdate = true;
}

// Oblique 투영의 역변환을 사용하여 스크린 좌표를 월드 좌표로 변환
export function screenToWorldCoords(
  screenX: number,
  screenY: number,
  camera: THREE.Camera,
  obliqueMatrix: THREE.Matrix4,
  gl: { domElement: HTMLElement }
): THREE.Vector3 {
  // 정규화된 디바이스 좌표로 변환
  const rect = gl.domElement.getBoundingClientRect();
  const ndcX = ((screenX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -((screenY - rect.top) / rect.height) * 2 + 1;

  // Raycaster 생성 - Oblique 투영이 적용되지 않은 원본 씬에서 계산
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

  // Oblique 투영 행렬의 역행렬
  const inverseMatrix = obliqueMatrix.clone().invert();

  // Oblique 투영이 적용된 평면의 법선과 위치를 역변환
  const originalPlaneNormal = new THREE.Vector3(0, 1, 0);
  const originalPlanePoint = new THREE.Vector3(0, 0, 0);
  
  // 평면 법선을 Oblique 변환
  const transformedNormal = originalPlaneNormal.clone().applyMatrix4(obliqueMatrix).normalize();
  const transformedPoint = originalPlanePoint.clone().applyMatrix4(obliqueMatrix);
  
  // 변환된 평면 생성
  const plane = new THREE.Plane();
  plane.setFromNormalAndCoplanarPoint(transformedNormal, transformedPoint);

  // Ray와 변환된 평면의 교점 계산
  const intersectPoint = new THREE.Vector3();
  const intersection = raycaster.ray.intersectPlane(plane, intersectPoint);

  if (!intersection) {
    console.warn('No intersection found');
    return new THREE.Vector3(0, 0, 0);
  }

  // 교점을 역변환하여 원래 월드 좌표로
  intersectPoint.applyMatrix4(inverseMatrix);

  return intersectPoint;
}

