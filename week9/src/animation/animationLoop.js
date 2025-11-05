import { AXES_INSET } from "../config/constants.js";

// 애니메이션 관리 클래스
export class AnimationLoop {
  constructor(config) {
    this.renderer = config.renderer;
    this.scene = config.scene;
    this.mainCamera = config.mainCamera;
    this.axesScene = config.axesScene;
    this.axesCamera = config.axesCamera;
    this.controls = config.controls;
    this.hoverInteraction = config.hoverInteraction;
    this.setObliqueProjection = config.setObliqueProjection;
    this.animatables = config.animatables || {};
    this.lights = config.lights || {};

    this.time = 0;
  }

  // 오브젝트 애니메이션
  animateObjects() {
    const { cube, cube2 } = this.animatables;

    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }

    if (cube2) {
      cube2.rotation.x -= 0.008;
      cube2.rotation.y -= 0.008;
    }
  }

  // 라이트 애니메이션
  animateLights() {
    const { accentLight1, accentLight2 } = this.lights;

    if (accentLight1) {
      accentLight1.intensity = 0.5 + Math.sin(this.time) * 0.2;
    }

    if (accentLight2) {
      accentLight2.intensity = 0.5 + Math.cos(this.time) * 0.2;
    }
  }

  // 메인 씬 렌더링
  renderMainScene() {
    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.mainCamera);
  }

  // 축 오버레이 렌더링
  renderAxesOverlay() {
    this.renderer.clearDepth();
    this.renderer.setScissor(
      window.innerWidth - AXES_INSET - 10,
      10,
      AXES_INSET,
      AXES_INSET
    );
    this.renderer.setViewport(
      window.innerWidth - AXES_INSET - 10,
      10,
      AXES_INSET,
      AXES_INSET
    );
    this.renderer.setScissorTest(true);

    this.axesCamera.position.copy(this.mainCamera.position).normalize();
    this.axesCamera.up.copy(this.mainCamera.up);
    this.axesCamera.lookAt(this.axesScene.position);

    this.renderer.render(this.axesScene, this.axesCamera);
    this.renderer.setScissorTest(false);
  }

  // 애니메이션 루프
  animate() {
    requestAnimationFrame(() => this.animate());

    this.time += 0.01;

    // 애니메이션 업데이트
    this.animateObjects();
    this.animateLights();

    // 투영 및 컨트롤 업데이트
    this.setObliqueProjection();
    this.controls.update();

    // 인터랙션 업데이트
    if (this.hoverInteraction) {
      this.hoverInteraction.update();
    }

    // 렌더링
    this.renderMainScene();
    this.renderAxesOverlay();
  }

  // 애니메이션 시작
  start() {
    this.animate();
  }
}
