import * as THREE from "three";

// 앰비언트 라이트 생성
export function createAmbientLight() {
  return new THREE.AmbientLight(0xffffff, 0.3);
}

// 메인 포인트 라이트 생성
export function createMainLight() {
  const mainLight = new THREE.PointLight(0xfff5e1, 1, 20);
  mainLight.position.set(0, 2, 0);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;

  return mainLight;
}

// 악센트 라이트들 생성
export function createAccentLights() {
  const accentLight1 = new THREE.PointLight(0x80d4ff, 0.5, 10);
  accentLight1.position.set(-3, 1, -3);

  const accentLight2 = new THREE.PointLight(0xff80aa, 0.5, 10);
  accentLight2.position.set(3, 1, 3);

  return { accentLight1, accentLight2 };
}

// 방향성 조명 생성
export function createDirectionalLight() {
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -10;
  dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -10;

  return dirLight;
}

// 모든 라이트 설정
export function setupLights(scene) {
  const ambientLight = createAmbientLight();
  const mainLight = createMainLight();
  const { accentLight1, accentLight2 } = createAccentLights();
  const dirLight = createDirectionalLight();

  scene.add(ambientLight);
  scene.add(mainLight);
  scene.add(accentLight1);
  scene.add(accentLight2);
  scene.add(dirLight);

  return { mainLight, accentLight1, accentLight2, dirLight };
}
