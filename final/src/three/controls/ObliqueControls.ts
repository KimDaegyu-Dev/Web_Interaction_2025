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
  edgeThresholdX: number; // 좌우 threshold
  edgeThresholdY: number; // 상하 threshold
  edgePanSpeed: number;
  currentMousePosition: THREE.Vector2;
  animationFrameId: number | null;
  edgeZone: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };

  private _onMouseDown: (e: MouseEvent) => void;
  private _onMouseMove: (e: MouseEvent) => void;
  private _onMouseUp: () => void;
  private _onWheel: (e: WheelEvent) => void;
  private _onMouseLeave: () => void;
  private _updateLoop: () => void;

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
    this.edgeThresholdX = 300; // 좌우 가장자리 감지 threshold (픽셀)
    this.edgeThresholdY = 300; // 상하 가장자리 감지 threshold (픽셀)
    this.edgePanSpeed = this.zoom ** 0.05; // 가장자리에서의 이동 속도
    this.currentMousePosition = new THREE.Vector2();
    this.animationFrameId = null;
    this.edgeZone = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

    // === 이벤트 바인딩 ===
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onWheel = this.onWheel.bind(this);
    this._onMouseLeave = this.onMouseLeave.bind(this);
    this._updateLoop = this.updateLoop.bind(this);

    // mousedown, mouseup 이벤트 제거 (드래그 비활성화)
    domElement.addEventListener("wheel", this._onWheel);
    domElement.addEventListener("mousemove", this._onMouseMove);
    domElement.addEventListener("mouseleave", this._onMouseLeave);

    // 애니메이션 루프 시작
    this.startUpdateLoop();
  }

  // === 마우스 다운 === (드래그 비활성화)
  private onMouseDown(e: MouseEvent): void {
    // 드래그 기능 제거됨
  }

  // === 마우스 업 === (드래그 비활성화)
  private onMouseUp(): void {
    // 드래그 기능 제거됨
  }

  // === 마우스 이동 ===
  private onMouseMove(e: MouseEvent): void {
    // 마우스 위치 업데이트 (가장자리 감지용)
    const rect = this.domElement.getBoundingClientRect();
    this.currentMousePosition.set(e.clientX - rect.left, e.clientY - rect.top);
    // 드래그 이동 기능 제거됨
  }

  // === 마우스가 뷰포트를 벗어남 ===
  private onMouseLeave(): void {
    this.currentMousePosition.set(-1, -1);
  }

  // === 가장자리 감지 및 자동 이동 (조이스틱 방식) ===
  private updateLoop(): void {
    const rect = this.domElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const thresholdX = this.edgeThresholdX;
    const thresholdY = this.edgeThresholdY;

    const x = this.currentMousePosition.x;
    const y = this.currentMousePosition.y;

    // 마우스가 뷰포트 밖에 있으면 이동하지 않음
    if (x < 0 || y < 0 || x > width || y > height) {
      this.edgeZone = { left: false, right: false, top: false, bottom: false };
      this.animationFrameId = requestAnimationFrame(this._updateLoop);
      return;
    }

    // 뷰포트 중심 계산
    const centerX = width / 2;
    const centerY = height / 2;

    // 중심에서 마우스까지의 방향 벡터 계산
    const dx = x - centerX;
    const dy = y - centerY;

    // 가장자리 threshold 영역 감지 (액자 모양)
    let isInEdgeZone = false;
    let intensity = 0;
    const edgeZone = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

    // 왼쪽 가장자리
    if (x < thresholdX) {
      isInEdgeZone = true;
      edgeZone.left = true;
      intensity = Math.max(intensity, (thresholdX - x) / thresholdX);
    }
    // 오른쪽 가장자리
    else if (x > width - thresholdX) {
      isInEdgeZone = true;
      edgeZone.right = true;
      intensity = Math.max(intensity, (x - (width - thresholdX)) / thresholdX);
    }

    // 위쪽 가장자리
    if (y < thresholdY) {
      isInEdgeZone = true;
      edgeZone.top = true;
      intensity = Math.max(intensity, (thresholdY - y) / thresholdY);
    }
    // 아래쪽 가장자리
    else if (y > height - thresholdY) {
      isInEdgeZone = true;
      edgeZone.bottom = true;
      intensity = Math.max(intensity, (y - (height - thresholdY)) / thresholdY);
    }

    // 가장자리 영역 상태 업데이트
    this.edgeZone = edgeZone;

    // 가장자리 영역에 있지 않으면 이동하지 않음
    if (!isInEdgeZone) {
      this.animationFrameId = requestAnimationFrame(this._updateLoop);
      return;
    }

    // 조이스틱처럼 중심에서 마우스 방향으로 이동
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) {
      this.animationFrameId = requestAnimationFrame(this._updateLoop);
      return;
    }

    // 방향 벡터 정규화
    const directionX = dx / distance;
    const directionY = dy / distance;

    // 이동 적용 (방향 반전: 마우스가 오른쪽에 있으면 씬이 왼쪽으로 이동)
    const speed = this.edgePanSpeed * intensity;
    this.panOffset.add(
      new THREE.Vector3(-directionX * speed, directionY * speed, 0),
    );

    this.animationFrameId = requestAnimationFrame(this._updateLoop);
  }

  // === 애니메이션 루프 시작 ===
  private startUpdateLoop(): void {
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(this._updateLoop);
    }
  }

  // === 애니메이션 루프 중지 ===
  private stopUpdateLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // === 휠 줌 ===
  private onWheel(e: WheelEvent): void {
    e.preventDefault();

    const delta = e.deltaY * 0.001;
    this.zoom = THREE.MathUtils.clamp(
      this.zoom + delta * this.zoomSpeed,
      0.01, // 카메라 zoom 0.01 (최대 줌인)
      0.5, // 카메라 zoom 0.5 (최대 줌아웃)
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

  // === 가장자리 영역 상태 가져오기 ===
  getEdgeZone(): {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  } {
    return this.edgeZone;
  }

  // === 업데이트 루프 ===
  update(): void {
    // 필요시 업데이트 로직 추가
  }

  // === 정리 ===
  dispose(): void {
    this.stopUpdateLoop();
    // mousedown, mouseup 이벤트 리스너 제거 (드래그 비활성화)
    this.domElement.removeEventListener("wheel", this._onWheel);
    this.domElement.removeEventListener("mousemove", this._onMouseMove);
    this.domElement.removeEventListener("mouseleave", this._onMouseLeave);
  }
}
