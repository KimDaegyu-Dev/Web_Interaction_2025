import * as THREE from "three";

// Oblique 투영 행렬 설정
export function setObliqueProjection(group, params, controls = null) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const sx = params.scaleX;
  const sy = params.scaleY;
  const sz = params.scaleZ;

  const rx = toRad(params.thetaX);
  const ry = toRad(params.thetaY);
  const rz = toRad(params.thetaZ);

  const xVec = new THREE.Vector3(Math.cos(rx) * sx, Math.sin(rx) * sx, 0);
  const yVec = new THREE.Vector3(Math.cos(ry) * sy, Math.sin(ry) * sy, 0);
  const zVec = new THREE.Vector3(Math.cos(rz) * sz, Math.sin(rz) * sz, 0);

  // 패닝 오프셋 가져오기
  const panOffset = controls ? controls.getPanOffset() : new THREE.Vector3(0, 0, 0);

  const mat = new THREE.Matrix4();
  mat.set(
    xVec.x,
    yVec.x,
    zVec.x,
    panOffset.x, // x translation
    xVec.y,
    yVec.y,
    zVec.y,
    panOffset.y, // y translation
    0,
    0,
    1,
    panOffset.z, // z translation
    0,
    0,
    0,
    1
  );

  group.matrixAutoUpdate = false;
  group.matrix.copy(mat);
  group.matrixWorldNeedsUpdate = true;
}

// 투영 설정 함수 팩토리
export function createProjectionSetter(group, params, controls) {
  return () => setObliqueProjection(group, params, controls);
}

