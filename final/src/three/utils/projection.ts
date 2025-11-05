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

