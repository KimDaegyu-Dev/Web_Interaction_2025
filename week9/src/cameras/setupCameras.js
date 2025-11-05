import * as THREE from "three";

// 메인 카메라 생성
export function createMainCamera() {
  const mainCamera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  mainCamera.position.set(1, 5, 5); // 모서리에서 대각선으로 내려다봄
  mainCamera.lookAt(0, 0, 0);
  
  return mainCamera;
}

// 축 오버레이용 카메라 생성
export function createAxesCamera(mainCamera) {
  const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  axesCamera.up = mainCamera.up;
  axesCamera.position.copy(mainCamera.position).normalize();
  
  return axesCamera;
}

// 모든 카메라 설정
export function setupCameras() {
  const mainCamera = createMainCamera();
  const axesCamera = createAxesCamera(mainCamera);
  
  return { mainCamera, axesCamera };
}

