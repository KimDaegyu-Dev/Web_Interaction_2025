import * as THREE from "three";
import { GUI } from "lil-gui";
import { ObliqueControls } from "./ObliqueControls.js";

// === 씬 세팅 ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// === 오브젝트 그룹 (먼저 생성) ===
const group = new THREE.Group();
scene.add(group);

// === 방 만들기 ===
const roomSize = 10;
const roomHeight = 6;

// 바닥
const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x2d3436,
  roughness: 0.8,
  metalness: 0.2,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -roomHeight / 2;
floor.receiveShadow = true;
group.add(floor);

// 천장
const ceilingMaterial = new THREE.MeshStandardMaterial({
  color: 0x34495e,
  roughness: 0.9,
  metalness: 0.1,
});
const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = roomHeight / 2;
ceiling.receiveShadow = true;
group.add(ceiling);

// 벽 4개
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x3d5a80,
  roughness: 0.7,
  metalness: 0.3,
});

// 뒷벽
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, roomHeight),
  wallMaterial
);
backWall.position.z = -roomSize / 2;
backWall.receiveShadow = true;
group.add(backWall);

// 앞벽
const frontWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, roomHeight),
  wallMaterial
);
frontWall.position.z = roomSize / 2;
frontWall.rotation.y = Math.PI;
frontWall.receiveShadow = true;
group.add(frontWall);

// 왼쪽 벽
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, roomHeight),
  wallMaterial
);
leftWall.position.x = -roomSize / 2;
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
group.add(leftWall);

// 오른쪽 벽
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomSize, roomHeight),
  wallMaterial
);
rightWall.position.x = roomSize / 2;
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
group.add(rightWall);

// === 좌표축 (작게) ===
scene.add(new THREE.AxesHelper(2));

// === 오버레이용 축 씬 ===
const axesScene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(1.5);
axesScene.add(axesHelper);

// === HUD용 2D 그리드 씬 (제거 또는 비활성화) ===
const hudCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
hudCamera.position.z = 1;

const gridLines = new THREE.Group();
function createHUDGrid(spacing = 0.1, count = 20) {
  gridLines.clear();
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
}
// createHUDGrid(); // HUD 그리드 비활성화

// === 메인 카메라 ===
const mainCamera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
mainCamera.position.set(0, 0, 10);
mainCamera.lookAt(0, 0, 0);

// === 축 카메라 ===
const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
axesCamera.up = mainCamera.up;
axesCamera.position.copy(mainCamera.position).normalize();
axesCamera.lookAt(axesScene.position);

// === 렌더러 ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// === 라이트 ===
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// 메인 조명 (천장 조명처럼)
const mainLight = new THREE.PointLight(0xfff5e1, 1, 20);
mainLight.position.set(0, 2, 0);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

// 보조 조명 (포인트 라이트)
const accentLight1 = new THREE.PointLight(0x80d4ff, 0.5, 10);
accentLight1.position.set(-3, 1, -3);
scene.add(accentLight1);

const accentLight2 = new THREE.PointLight(0xff80aa, 0.5, 10);
accentLight2.position.set(3, 1, 3);
scene.add(accentLight2);

// 방향성 조명 (그림자용)
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
scene.add(dirLight);

// === 오브젝트 ===
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x6c5ce7,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0x4a3f8f,
    emissiveIntensity: 0.2,
  })
);
cube.castShadow = true;
cube.receiveShadow = true;
group.add(cube);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0xff6b9d,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0xff4757,
    emissiveIntensity: 0.2,
  })
);
cube2.position.z = 3;
cube2.castShadow = true;
cube2.receiveShadow = true;
group.add(cube2);

// 받침대 (pedestal)
const pedestal = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.8, 0.3, 32),
  new THREE.MeshStandardMaterial({
    color: 0x95a5a6,
    metalness: 0.8,
    roughness: 0.2,
  })
);
pedestal.position.y = -1;
pedestal.castShadow = true;
pedestal.receiveShadow = true;
group.add(pedestal);

const pedestal2 = pedestal.clone();
pedestal2.position.z = 3;
pedestal2.castShadow = true;
pedestal2.receiveShadow = true;
group.add(pedestal2);

// === 장식 요소 ===

// 바닥 패턴 (체크무늬)
const patternSize = 1;
for (let x = -roomSize / 2; x < roomSize / 2; x += patternSize) {
  for (let z = -roomSize / 2; z < roomSize / 2; z += patternSize) {
    if ((Math.floor(x / patternSize) + Math.floor(z / patternSize)) % 2 === 0) {
      const tile = new THREE.Mesh(
        new THREE.PlaneGeometry(patternSize, patternSize),
        new THREE.MeshStandardMaterial({
          color: 0x1e272e,
          roughness: 0.9,
          metalness: 0.1,
        })
      );
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(
        x + patternSize / 2,
        -roomHeight / 2 + 0.01,
        z + patternSize / 2
      );
      tile.receiveShadow = true;
      group.add(tile);
    }
  }
}

// 벽 액자들
const frameGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x2c3e50,
  metalness: 0.5,
  roughness: 0.5,
});

// 뒷벽 액자
const frame1 = new THREE.Mesh(frameGeometry, frameMaterial);
frame1.position.set(-2, 0.5, -roomSize / 2 + 0.05);
frame1.castShadow = true;
group.add(frame1);

const frame2 = new THREE.Mesh(frameGeometry, frameMaterial);
frame2.position.set(2, 0.5, -roomSize / 2 + 0.05);
frame2.castShadow = true;
group.add(frame2);

// 액자 안쪽 (그림)
const artMaterial1 = new THREE.MeshStandardMaterial({
  color: 0xe74c3c,
  emissive: 0xe74c3c,
  emissiveIntensity: 0.3,
});
const art1 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.8), artMaterial1);
art1.position.set(-2, 0.5, -roomSize / 2 + 0.11);
group.add(art1);

const artMaterial2 = new THREE.MeshStandardMaterial({
  color: 0x3498db,
  emissive: 0x3498db,
  emissiveIntensity: 0.3,
});
const art2 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.8), artMaterial2);
art2.position.set(2, 0.5, -roomSize / 2 + 0.11);
group.add(art2);

// 천장 조명 장식
const lightFixture = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 16, 16),
  new THREE.MeshStandardMaterial({
    color: 0xfff5e1,
    emissive: 0xfff5e1,
    emissiveIntensity: 1,
  })
);
lightFixture.position.set(0, 2, 0);
group.add(lightFixture);

// 방 모서리 기둥
const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.15, roomHeight, 8);
const pillarMaterial = new THREE.MeshStandardMaterial({
  color: 0x34495e,
  metalness: 0.4,
  roughness: 0.6,
});

const pillarPositions = [
  [-roomSize / 2 + 0.2, 0, -roomSize / 2 + 0.2],
  [roomSize / 2 - 0.2, 0, -roomSize / 2 + 0.2],
  [-roomSize / 2 + 0.2, 0, roomSize / 2 - 0.2],
  [roomSize / 2 - 0.2, 0, roomSize / 2 - 0.2],
];

pillarPositions.forEach((pos) => {
  const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  pillar.position.set(...pos);
  pillar.castShadow = true;
  pillar.receiveShadow = true;
  group.add(pillar);
});

// === 파라미터 ===
const params = {
  thetaX: 0, // x축: 수평 (0도)
  thetaY: 90, // y축: 수직 (90도)
  thetaZ: 225, // z축: 비스듬히 왼쪽 아래 (225도)
  scaleX: 1,
  scaleY: 1,
  scaleZ: 0.7, // z축 스케일 줄여서 자연스러운 오블리크
};

// === 투영 행렬 ===
function setObliqueProjection() {
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

  // 패닝 오프셋 가져오기 (controls가 초기화된 후에만)
  const panOffset =
    typeof controls !== "undefined"
      ? controls.getPanOffset()
      : new THREE.Vector3(0, 0, 0);

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

// === 프리셋 ===
const presets = {
  Standard: () => {
    Object.assign(params, {
      thetaX: 0,
      thetaY: 90,
      thetaZ: 225,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.7,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  Cabinet: () => {
    Object.assign(params, {
      thetaX: 0,
      thetaY: 90,
      thetaZ: 225,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.5,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  Cavalier: () => {
    Object.assign(params, {
      thetaX: 0,
      thetaY: 90,
      thetaZ: 225,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  Isometric: () => {
    Object.assign(params, {
      thetaX: 30,
      thetaY: 150,
      thetaZ: 270,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
};

// === GUI ===
const gui = new GUI();
const folderAngles = gui.addFolder("Projection Angles");
folderAngles.add(params, "thetaX", 0, 360, 1).onChange(setObliqueProjection);
folderAngles.add(params, "thetaY", 0, 360, 1).onChange(setObliqueProjection);
folderAngles.add(params, "thetaZ", 0, 360, 1).onChange(setObliqueProjection);
folderAngles.open();

const folderScales = gui.addFolder("Axis Scales");
folderScales.add(params, "scaleX", 0.1, 2, 0.01).onChange(setObliqueProjection);
folderScales.add(params, "scaleY", 0.1, 2, 0.01).onChange(setObliqueProjection);
folderScales.add(params, "scaleZ", 0.1, 2, 0.01).onChange(setObliqueProjection);
folderScales.open();

const folderPresets = gui.addFolder("Presets");
folderPresets.add(presets, "Standard");
folderPresets.add(presets, "Cabinet");
folderPresets.add(presets, "Cavalier");
folderPresets.add(presets, "Isometric");
folderPresets.open();

// === ObliqueControls ===
const controls = new ObliqueControls(
  mainCamera,
  renderer.domElement,
  params,
  setObliqueProjection
);

// 초기 투영 설정
setObliqueProjection();

// === Raycaster for hover detection ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

// 마우스 이동 이벤트
window.addEventListener("mousemove", (event) => {
  // 마우스 좌표를 정규화된 디바이스 좌표로 변환 (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 호버 감지 함수
function checkHover() {
  raycaster.setFromCamera(mouse, mainCamera);
  const intersects = raycaster.intersectObjects([cube, cube2], false);

  if (intersects.length > 0) {
    const newHovered = intersects[0].object;

    // 새로운 오브젝트에 호버
    if (hoveredObject !== newHovered) {
      // 이전 호버 오브젝트 복원
      if (hoveredObject) {
        hoveredObject.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      // 새 오브젝트 크기 증가
      hoveredObject = newHovered;
    }
    // 부드러운 스케일 증가
    if (hoveredObject) {
      hoveredObject.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    }
  } else {
    // 호버 해제
    if (hoveredObject) {
      hoveredObject.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      if (hoveredObject.scale.x < 1.01) {
        hoveredObject.scale.set(1, 1, 1);
        hoveredObject = null;
      }
    }
  }
}

// === 애니메이션 루프 ===
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // 큐브 회전
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube2.rotation.x -= 0.008;
  cube2.rotation.y -= 0.008;

  // 조명 애니메이션
  accentLight1.intensity = 0.5 + Math.sin(time) * 0.2;
  accentLight2.intensity = 0.5 + Math.cos(time) * 0.2;

  setObliqueProjection();
  controls.update();
  checkHover();

  // 1️⃣ 메인 씬
  renderer.clear();
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render(scene, mainCamera);

  // 2️⃣ HUD Grid (항상 화면 고정)
  renderer.clearDepth();
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

  // 3️⃣ 축 오버레이
  const inset = 120;
  renderer.clearDepth();
  renderer.setScissor(window.innerWidth - inset - 10, 10, inset, inset);
  renderer.setViewport(window.innerWidth - inset - 10, 10, inset, inset);
  renderer.setScissorTest(true);
  axesCamera.position.copy(mainCamera.position).normalize();
  axesCamera.up.copy(mainCamera.up);
  axesCamera.lookAt(axesScene.position);
  renderer.render(axesScene, axesCamera);
  renderer.setScissorTest(false);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  mainCamera.updateProjectionMatrix();
});
