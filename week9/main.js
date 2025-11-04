import * as THREE from "three";
import { GUI } from "lil-gui";
import { ObliqueControls } from "./ObliqueControls.js";

// === 씬 세팅 ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// === 좌표축, 격자, 큐브 ===
scene.add(new THREE.GridHelper(1000, 1000));
scene.add(new THREE.AxesHelper(2));

// === 오버레이용 축 씬 ===
const axesScene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(1.5);
axesScene.add(axesHelper);

// === HUD용 2D 그리드 씬 ===
const hudCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
hudCamera.position.z = 1;

const gridLines = new THREE.Group();
function createHUDGrid(spacing = 0.1, count = 20) {
  gridLines.clear();
  const material = new THREE.LineBasicMaterial({ color: 0x333333 });
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
createHUDGrid();

// === 메인 카메라 ===
const mainCamera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
mainCamera.position.set(5, 5, 5);
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
document.body.appendChild(renderer.domElement);

// === 라이트 ===
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// === 오브젝트 ===
const group = new THREE.Group();
scene.add(group);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x3399ff,
    metalness: 0.2,
    roughness: 0.6,
  })
);
group.add(cube);
const cube2 = cube.clone();
cube2.position.z = 3;
group.add(cube2);

// === 파라미터 ===
const params = {
  thetaX: 30,
  thetaY: 150,
  thetaZ: 270,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  // 회전 제한
  maxRotation: 45,
  minRotation: -45,
  // 복귀 속도
  returnSpeed: 0.05,
};

// 원래 각도 저장
const originalAngles = {
  thetaX: 30,
  thetaY: 150,
  thetaZ: 270,
};

// 복귀 애니메이션 상태
let isReturning = false;

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

  const mat = new THREE.Matrix4();
  mat.set(
    xVec.x,
    yVec.x,
    zVec.x,
    0,
    xVec.y,
    yVec.y,
    zVec.y,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );

  group.matrixAutoUpdate = false;
  group.matrix.copy(mat);
  group.matrixWorldNeedsUpdate = true;
}

// 복귀 애니메이션 함수
function returnToOriginal() {
  if (!isReturning) return;

  let hasReturned = true;

  // thetaX 복귀
  const diffX = originalAngles.thetaX - params.thetaX;
  if (Math.abs(diffX) > 0.5) {
    params.thetaX += diffX * params.returnSpeed;
    hasReturned = false;
  } else {
    params.thetaX = originalAngles.thetaX;
  }

  // thetaY 복귀
  const diffY = originalAngles.thetaY - params.thetaY;
  if (Math.abs(diffY) > 0.5) {
    params.thetaY += diffY * params.returnSpeed;
    hasReturned = false;
  } else {
    params.thetaY = originalAngles.thetaY;
  }

  // thetaZ 복귀
  const diffZ = originalAngles.thetaZ - params.thetaZ;
  if (Math.abs(diffZ) > 0.5) {
    params.thetaZ += diffZ * params.returnSpeed;
    hasReturned = false;
  } else {
    params.thetaZ = originalAngles.thetaZ;
  }

  if (hasReturned) {
    isReturning = false;
  }

  setObliqueProjection();
}

// === 프리셋 ===
const presets = {
  Isometric: () => {
    Object.assign(params, {
      thetaX: 30,
      thetaY: 150,
      thetaZ: 270,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    });
    Object.assign(originalAngles, {
      thetaX: 30,
      thetaY: 150,
      thetaZ: 270,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  Dimetric: () => {
    Object.assign(params, {
      thetaX: 25,
      thetaY: 155,
      thetaZ: 270,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.8,
    });
    Object.assign(originalAngles, {
      thetaX: 25,
      thetaY: 155,
      thetaZ: 270,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  CabinetOblique: () => {
    Object.assign(params, {
      thetaX: 45,
      thetaY: 135,
      thetaZ: 270,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.5,
    });
    Object.assign(originalAngles, {
      thetaX: 45,
      thetaY: 135,
      thetaZ: 270,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  ReverseOblique: () => {
    Object.assign(params, {
      thetaX: 225,
      thetaY: 315,
      thetaZ: 90,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    });
    Object.assign(originalAngles, {
      thetaX: 225,
      thetaY: 315,
      thetaZ: 90,
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
folderPresets.add(presets, "Isometric");
folderPresets.add(presets, "Dimetric");
folderPresets.add(presets, "CabinetOblique");
folderPresets.add(presets, "ReverseOblique");
folderPresets.open();

const folderRotationLimits = gui.addFolder("Rotation Limits");
folderRotationLimits.add(params, "maxRotation", 0, 180, 1).name("Max Rotation");
folderRotationLimits
  .add(params, "minRotation", -180, 0, 1)
  .name("Min Rotation");
folderRotationLimits
  .add(params, "returnSpeed", 0.01, 0.2, 0.01)
  .name("Return Speed");
folderRotationLimits.open();

// === ObliqueControls ===
const controls = new ObliqueControls(
  mainCamera,
  renderer.domElement,
  params,
  setObliqueProjection,
  originalAngles,
  () => isReturning,
  (value) => {
    isReturning = value;
  }
);

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
  const intersects = raycaster.intersectObjects([cube, cube2]);

  if (intersects.length > 0) {
    const newHovered = intersects[0].object;

    // 새로운 오브젝트에 호버
    if (hoveredObject !== newHovered) {
      // 이전 호버 오브젝트 복원
      if (hoveredObject) {
        hoveredObject.scale.set(1, 1, 1);
      }
      // 새 오브젝트 크기 증가
      hoveredObject = newHovered;
      hoveredObject.scale.set(1.3, 1.3, 1.3);
    }
  } else {
    // 호버 해제
    if (hoveredObject) {
      hoveredObject.scale.set(1, 1, 1);
      hoveredObject = null;
    }
  }
}

// === 애니메이션 루프 ===
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // 복귀 애니메이션 실행
  returnToOriginal();

  setObliqueProjection();
  controls.update(group);
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
