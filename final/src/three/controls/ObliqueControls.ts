import * as THREE from "three";

export class ObliqueControls {
  camera: THREE.Camera;
  domElement: HTMLElement;
  isDragging: boolean;
  prevMouse: THREE.Vector2;
  panOffset: THREE.Vector3;
  zoom: number;
  panSpeed: number;
  zoomSpeed: number;

  private _onMouseDown: (e: MouseEvent) => void;
  private _onMouseMove: (e: MouseEvent) => void;
  private _onMouseUp: () => void;
  private _onWheel: (e: WheelEvent) => void;

  constructor(camera: THREE.Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    // === 기본 상태 ===
    this.isDragging = false;
    this.prevMouse = new THREE.Vector2();
    this.panOffset = new THREE.Vector3();

    // 카메라의 현재 zoom 값으로 초기화 (갑작스러운 줌 변화 방지)
    if (camera instanceof THREE.OrthographicCamera) {
      this.zoom = 1 / camera.zoom;
    } else {
      this.zoom = 1.0;
    }

    // === 설정값 ===
    this.panSpeed = 0.01;
    this.zoomSpeed = 0.05; // 줌 민감도 (작을수록 부드러움)

    // === 이벤트 바인딩 ===
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onWheel = this.onWheel.bind(this);

    domElement.addEventListener("mousedown", this._onMouseDown);
    domElement.addEventListener("wheel", this._onWheel);
    window.addEventListener("mouseup", this._onMouseUp);
    window.addEventListener("mousemove", this._onMouseMove);
  }

  // === 마우스 다운 ===
  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.isDragging = true;
    this.prevMouse.set(e.clientX, e.clientY);
  }

  // === 마우스 업 ===
  private onMouseUp(): void {
    this.isDragging = false;
  }

  // === 마우스 이동 ===
  private onMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    const dx = e.clientX - this.prevMouse.x;
    const dy = e.clientY - this.prevMouse.y;
    this.prevMouse.set(e.clientX, e.clientY);

    // 드래그 → 평행 이동 (카메라는 고정, panOffset만 변경)
    const panX = -dx * this.panSpeed;
    const panY = dy * this.panSpeed;
    this.panOffset.add(new THREE.Vector3(panX, panY, 0));
  }

  // === 휠 줌 ===
  private onWheel(e: WheelEvent): void {
    e.preventDefault();

    const delta = e.deltaY * 0.001;
    this.zoom = THREE.MathUtils.clamp(
      this.zoom + delta * this.zoomSpeed,
      0.01, // 카메라 zoom 100 (최대 줌인)
      0.1, // 카메라 zoom 10 (최대 줌아웃)
    );

    // OrthographicCamera인 경우에만 zoom 업데이트
    if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.zoom = 1 / this.zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  // === 패닝 오프셋 가져오기 ===
  getPanOffset(): THREE.Vector3 {
    return this.panOffset;
  }

  // === 업데이트 루프 ===
  update(): void {
    // 필요시 업데이트 로직 추가
  }

  // === 정리 ===
  dispose(): void {
    this.domElement.removeEventListener("mousedown", this._onMouseDown);
    this.domElement.removeEventListener("wheel", this._onWheel);
    window.removeEventListener("mouseup", this._onMouseUp);
    window.removeEventListener("mousemove", this._onMouseMove);
  }
}
