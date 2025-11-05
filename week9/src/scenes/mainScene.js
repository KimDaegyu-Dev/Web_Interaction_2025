import * as THREE from "three";

// 메인 씬 생성 및 설정
export function createMainScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  
  // 오브젝트 그룹 생성
  const group = new THREE.Group();
  scene.add(group);
  
  // 좌표축 헬퍼 추가
  scene.add(new THREE.AxesHelper(2));
  
  return { scene, group };
}

// 축 오버레이용 씬 생성
export function createAxesScene() {
  const axesScene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(1.5);
  axesScene.add(axesHelper);
  
  return axesScene;
}

// HUD용 그리드 씬 생성 (선택적)
export function createHUDCamera() {
  const hudCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
  hudCamera.position.z = 1;
  
  return hudCamera;
}

// HUD 그리드 생성 (선택적)
export function createHUDGrid(spacing = 0.1, count = 20) {
  const gridLines = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0x1a1a2e,
    transparent: true,
    opacity: 0.1,
  });
  const half = spacing * count * 0.5;
  const positions = [];

  for (let i = -count / 2; i <= count / 2; i++) {
    const x = i * spacing;
    // 수평선
    positions.push(-half, x, 0, half, x, 0);
    // 수직선
    positions.push(x, -half, 0, x, half, 0);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  const grid = new THREE.LineSegments(geometry, material);
  gridLines.add(grid);
  
  return gridLines;
}

