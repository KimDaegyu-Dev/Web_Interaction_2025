import * as THREE from "three";

/**
 * 아이소메트릭 뷰용 컨트롤
 * - 우클릭 드래그: 맵 패닝 (이동)
 * - 마우스 휠: 줌 인/아웃
 * - 가장자리 호버: 자동 스크롤 (조이스틱 방식)
 */
export class IsometricControls {
  camera: THREE.Camera;
  domElement: HTMLElement;
  
  // 드래그 상태
  isDragging: boolean;
  prevMouse: THREE.Vector2;
  
  // 이동 및 줌
  panOffset: THREE.Vector3;
  zoom: number;
  
  // 설정값
  panSpeed: number;
  zoomSpeed: number;
  minZoom: number;
  maxZoom: number;
  
  // 가장자리 스크롤 설정
  edgeThresholdX: number;
  edgeThresholdY: number;
  edgePanSpeed: number;
  currentMousePosition: THREE.Vector2;
  animationFrameId: number | null;
  
  // 가장자리 영역 상태
  edgeZone: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };

  // 이벤트 핸들러 참조
  private _onMouseDown: (e: MouseEvent) => void;
  private _onMouseMove: (e: MouseEvent) => void;
  private _onMouseUp: () => void;
  private _onWheel: (e: WheelEvent) => void;
  private _onMouseLeave: () => void;
  private _onContextMenu: (e: MouseEvent) => void;
  private _updateLoop: () => void;
  
  // 상태 변경 콜백
  public onChange: ((state: { x: number; y: number; zoom: number }) => void) | null = null;

  constructor(
    camera: THREE.Camera,
    domElement: HTMLElement,
    onChange?: (state: { x: number; y: number; zoom: number }) => void
  ) {
    this.camera = camera;
    this.domElement = domElement;
    this.onChange = onChange || null;

    // 기본 상태 초기화
    this.isDragging = false;
    this.prevMouse = new THREE.Vector2();
    this.panOffset = new THREE.Vector3();

    // 카메라의 현재 zoom 값으로 초기화
    if (camera instanceof THREE.OrthographicCamera) {
      this.zoom = 1 / camera.zoom;
    } else {
      this.zoom = 1.0;
    }

    // 설정값
    this.panSpeed = 0.015;
    this.zoomSpeed = 0.05;
    this.minZoom = 0.01;  // 최대 줌인
    this.maxZoom = 0.5;   // 최대 줌아웃
    
    // 가장자리 스크롤 설정
    this.edgeThresholdX = 250;
    this.edgeThresholdY = 200;
    this.edgePanSpeed = 0.3;
    this.currentMousePosition = new THREE.Vector2(-1, -1);
    this.animationFrameId = null;
    
    this.edgeZone = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

    // 이벤트 핸들러 바인딩
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onWheel = this.onWheel.bind(this);
    this._onMouseLeave = this.onMouseLeave.bind(this);
    this._onContextMenu = this.onContextMenu.bind(this);
    this._updateLoop = this.updateLoop.bind(this);

    // 이벤트 리스너 등록
    domElement.addEventListener("mousedown", this._onMouseDown);
    domElement.addEventListener("mousemove", this._onMouseMove);
    domElement.addEventListener("mouseup", this._onMouseUp);
    domElement.addEventListener("wheel", this._onWheel, { passive: false });
    domElement.addEventListener("mouseleave", this._onMouseLeave);
    domElement.addEventListener("contextmenu", this._onContextMenu);

    // 애니메이션 루프 시작
    this.startUpdateLoop();
  }

  /** 우클릭 기본 메뉴 방지 */
  private onContextMenu(e: MouseEvent): void {
    e.preventDefault();
  }

  /** 마우스 다운 - 우클릭 드래그 시작 */
  private onMouseDown(e: MouseEvent): void {
    // 우클릭 (button === 2)
    if (e.button === 2) {
      this.isDragging = true;
      this.prevMouse.set(e.clientX, e.clientY);
      this.domElement.style.cursor = "grabbing";
    }
  }

  /** 마우스 이동 - 드래그 패닝 + 가장자리 감지 */
  private onMouseMove(e: MouseEvent): void {
    const rect = this.domElement.getBoundingClientRect();
    this.currentMousePosition.set(e.clientX - rect.left, e.clientY - rect.top);

    // 우클릭 드래그 중이면 패닝
    if (this.isDragging) {
      const deltaX = e.clientX - this.prevMouse.x;
      const deltaY = e.clientY - this.prevMouse.y;

      // 줌 레벨에 따른 패닝 속도 조정
      const adjustedSpeed = this.panSpeed * this.zoom;
      
      this.panOffset.x -= deltaX * adjustedSpeed;
      this.panOffset.y += deltaY * adjustedSpeed;

      this.prevMouse.set(e.clientX, e.clientY);

      // 상태 변경 알림
      this.notifyChange();
    }
  }

  /** 마우스 업 - 드래그 종료 */
  private onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.domElement.style.cursor = "default";
    }
  }

  /** 마우스가 뷰포트를 벗어남 */
  private onMouseLeave(): void {
    this.currentMousePosition.set(-1, -1);
    if (this.isDragging) {
      this.isDragging = false;
      this.domElement.style.cursor = "default";
    }
  }

  /** 휠 줌 */
  private onWheel(e: WheelEvent): void {
    e.preventDefault();

    const delta = e.deltaY * 0.001;
    this.zoom = THREE.MathUtils.clamp(
      this.zoom + delta * this.zoomSpeed,
      this.minZoom,
      this.maxZoom
    );

    // OrthographicCamera인 경우에만 zoom 업데이트
    if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.zoom = 1 / this.zoom;
      this.camera.updateProjectionMatrix();
    }

    // 가장자리 패닝 속도도 줌에 따라 조정
    this.edgePanSpeed = 0.3 * Math.sqrt(this.zoom);

    this.notifyChange();
  }

  /** 가장자리 감지 및 자동 스크롤 (조이스틱 방식) */
  private updateLoop(): void {
    // 드래그 중이면 가장자리 스크롤 비활성화
    if (this.isDragging) {
      this.edgeZone = { left: false, right: false, top: false, bottom: false };
      this.animationFrameId = requestAnimationFrame(this._updateLoop);
      return;
    }

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

    // 가장자리 영역 감지
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

    this.edgeZone = edgeZone;

    // 가장자리 영역에 없으면 이동하지 않음
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
      new THREE.Vector3(-directionX * speed, directionY * speed, 0)
    );

    this.notifyChange();

    this.animationFrameId = requestAnimationFrame(this._updateLoop);
  }

  /** 상태 변경 알림 */
  private notifyChange(): void {
    if (this.onChange) {
      this.onChange({
        x: this.panOffset.x,
        y: this.panOffset.y,
        zoom: this.zoom,
      });
    }
  }

  /** 애니메이션 루프 시작 */
  private startUpdateLoop(): void {
    if (this.animationFrameId === null) {
      this.animationFrameId = requestAnimationFrame(this._updateLoop);
    }
  }

  /** 애니메이션 루프 중지 */
  private stopUpdateLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /** 패닝 오프셋 가져오기 */
  getPanOffset(): THREE.Vector3 {
    return this.panOffset;
  }

  /** 가장자리 영역 상태 가져오기 */
  getEdgeZone(): {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  } {
    return this.edgeZone;
  }

  /** 상태 설정 */
  setState(x: number, y: number, zoom: number): void {
    this.panOffset.set(x, y, 0);
    this.zoom = zoom;

    if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.zoom = 1 / this.zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  /** 업데이트 */
  update(): void {
    // 필요시 추가 로직
  }

  /** 정리 */
  dispose(): void {
    this.stopUpdateLoop();
    this.domElement.removeEventListener("mousedown", this._onMouseDown);
    this.domElement.removeEventListener("mousemove", this._onMouseMove);
    this.domElement.removeEventListener("mouseup", this._onMouseUp);
    this.domElement.removeEventListener("wheel", this._onWheel);
    this.domElement.removeEventListener("mouseleave", this._onMouseLeave);
    this.domElement.removeEventListener("contextmenu", this._onContextMenu);
  }
}
