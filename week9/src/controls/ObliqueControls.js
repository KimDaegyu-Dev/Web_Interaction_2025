import * as THREE from "three";

export class ObliqueControls {
  constructor(camera, domElement, params, setObliqueProjection) {
    this.camera = camera;
    this.domElement = domElement;
    this.params = params;
    this.setObliqueProjection = setObliqueProjection;

    // === 기본 상태 ===
    this.isDragging = false;
    this.prevMouse = new THREE.Vector2();
    this.panOffset = new THREE.Vector3();
    this.zoom = 1.0;

    // === 설정값 ===
    this.panSpeed = 0.01;
    this.zoomSpeed = 0.1;

    // === 이벤트 바인딩 ===
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onWheel = this._onWheel.bind(this);

    domElement.addEventListener("mousedown", this._onMouseDown);
    domElement.addEventListener("wheel", this._onWheel);
    window.addEventListener("mouseup", this._onMouseUp);
    window.addEventListener("mousemove", this._onMouseMove);
  }

  // === 마우스 다운 ===
  _onMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    this.prevMouse.set(e.clientX, e.clientY);
  }

  // === 마우스 업 ===
  _onMouseUp() {
    this.isDragging = false;
  }

  // === 마우스 이동 ===
  _onMouseMove(e) {
    if (!this.isDragging) return;

    const dx = e.clientX - this.prevMouse.x;
    const dy = e.clientY - this.prevMouse.y;
    this.prevMouse.set(e.clientX, e.clientY);

    // 드래그 → 평행 이동
    const panX = -dx * this.panSpeed * this.zoom;
    const panY = dy * this.panSpeed * this.zoom;
    this.panOffset.add(new THREE.Vector3(panX, panY, 0));
  }

  // === 휠 줌 ===
  _onWheel(e) {
    const delta = e.deltaY * 0.001;
    this.zoom = THREE.MathUtils.clamp(
      this.zoom + delta * this.zoomSpeed,
      0.2,
      5
    );
    this.camera.zoom = 1 / this.zoom;
    this.camera.updateProjectionMatrix();
  }

  // === 패닝 오프셋 가져오기 ===
  getPanOffset() {
    return this.panOffset;
  }

  // === 업데이트 루프 ===
  update() {
    // setObliqueProjection에서 panOffset을 사용하도록 변경
  }

  // === 정리 ===
  dispose() {
    this.domElement.removeEventListener("mousedown", this._onMouseDown);
    this.domElement.removeEventListener("wheel", this._onWheel);
    window.removeEventListener("mouseup", this._onMouseUp);
    window.removeEventListener("mousemove", this._onMouseMove);
  }
}
