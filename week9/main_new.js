import { params } from "./src/config/params.js";
import { createMainScene, createAxesScene } from "./src/scenes/mainScene.js";
import { createRoom } from "./src/objects/room.js";
import { createDisplayObjects } from "./src/objects/displayObjects.js";
import { createDecorations } from "./src/objects/decorations.js";
import { setupLights } from "./src/lights/setupLights.js";
import { setupCameras } from "./src/cameras/setupCameras.js";
import { createProjectionSetter } from "./src/utils/projection.js";
import { HoverInteraction } from "./src/utils/interaction.js";
import { createRenderer, setupResizeHandler } from "./src/utils/renderer.js";
import { setupGUI } from "./src/gui/setupGUI.js";
import { ObliqueControls } from "./src/controls/ObliqueControls.js";
import { AnimationLoop } from "./src/animation/animationLoop.js";

// === 초기화 ===
function init() {
  // 씬 생성
  const { scene, group } = createMainScene();
  const axesScene = createAxesScene();

  // 방과 오브젝트 생성
  createRoom(group);
  const { cube, cube2 } = createDisplayObjects(group);
  createDecorations(group);

  // 라이트 설정
  const lights = setupLights(scene);

  // 카메라 설정
  const { mainCamera, axesCamera } = setupCameras();

  // 렌더러 생성
  const renderer = createRenderer();
  document.body.appendChild(renderer.domElement);

  // 투영 설정 (controls 없이 먼저 생성)
  const setObliqueProjection = createProjectionSetter(group, params, null);

  // GUI 설정
  setupGUI(params, setObliqueProjection);

  // Controls 설정
  const controls = new ObliqueControls(
    mainCamera,
    renderer.domElement,
    params,
    setObliqueProjection
  );

  // 투영 함수 업데이트 (controls 포함)
  const setObliqueProjectionWithControls = createProjectionSetter(
    group,
    params,
    controls
  );

  // 초기 투영 설정
  setObliqueProjectionWithControls();

  // 호버 인터랙션 설정
  const hoverInteraction = new HoverInteraction(mainCamera, [cube, cube2]);

  // 윈도우 리사이즈 핸들러
  setupResizeHandler(renderer, mainCamera);

  // 애니메이션 루프 설정 및 시작
  const animationLoop = new AnimationLoop({
    renderer,
    scene,
    mainCamera,
    axesScene,
    axesCamera,
    controls,
    hoverInteraction,
    setObliqueProjection: setObliqueProjectionWithControls,
    animatables: { cube, cube2 },
    lights,
  });

  animationLoop.start();
}

// 앱 시작
init();

