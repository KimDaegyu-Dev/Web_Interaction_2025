import * as THREE from "three";

export class ObliqueControls {
  constructor(
    camera,
    domElement,
    params,
    setObliqueProjection,
    originalAngles,
    getIsReturning,
    setIsReturning
  ) {
    this.camera = camera;
    this.domElement = domElement;
    this.params = params;
    this.setObliqueProjection = setObliqueProjection;
    this.originalAngles = originalAngles;
    this.getIsReturning = getIsReturning;
    this.setIsReturning = setIsReturning;

    // === 기본 상태 ===
    this.isDragging = false;
    this.isPanning = false;
    this.prevMouse = new THREE.Vector2();
    this.panOffset = new THREE.Vector3();
    this.zoom = 1.0;

    // === 설정값 ===
    this.rotateSpeed = 0.3;
    this.panSpeed = 0.005;
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
    this.isPanning = e.shiftKey;
    this.prevMouse.set(e.clientX, e.clientY);

    // 회전 시작 시 현재 각도를 원래 각도로 저장
    if (!this.isPanning) {
      // 복귀 애니메이션 중이 아닐 때만 현재 각도를 원래 각도로 저장
      // 복귀 애니메이션 중이면 이미 저장된 originalAngles를 유지
      if (!this.getIsReturning()) {
        this.originalAngles.thetaX = this.params.thetaX;
        this.originalAngles.thetaY = this.params.thetaY;
        this.originalAngles.thetaZ = this.params.thetaZ;
      }
      // 복귀 애니메이션 중단
      this.setIsReturning(false);
    }
  }

  // === 마우스 업 ===
  _onMouseUp() {
    const wasDragging = this.isDragging;
    const wasPanning = this.isPanning;

    this.isDragging = false;
    this.isPanning = false;

    // 회전 드래그였다면 복귀 애니메이션 시작
    if (wasDragging && !wasPanning) {
      this.setIsReturning(true);
    }
  }

  // === 마우스 이동 ===
  _onMouseMove(e) {
    if (!this.isDragging) return;

    const dx = e.clientX - this.prevMouse.x;
    const dy = e.clientY - this.prevMouse.y;
    this.prevMouse.set(e.clientX, e.clientY);

    if (this.isPanning) {
      // Shift + 드래그 → 평행 이동
      const panX = -dx * this.panSpeed * this.zoom;
      const panY = dy * this.panSpeed * this.zoom;
      this.panOffset.add(new THREE.Vector3(panX, panY, 0));
    } else {
      // 일반 드래그 → 회전 (thetaX, thetaY)
      const deltaX = dx * this.rotateSpeed;
      const deltaY = dy * this.rotateSpeed;

      // 새 각도 계산
      let newThetaX = this.params.thetaX + deltaX;
      let newThetaY = this.params.thetaY + deltaY;

      // 원래 각도로부터의 차이 계산
      const diffX = newThetaX - this.originalAngles.thetaX;
      const diffY = newThetaY - this.originalAngles.thetaY;

      // 회전 제한 적용
      if (diffX > this.params.maxRotation) {
        newThetaX = this.originalAngles.thetaX + this.params.maxRotation;
      } else if (diffX < this.params.minRotation) {
        newThetaX = this.originalAngles.thetaX + this.params.minRotation;
      }

      if (diffY > this.params.maxRotation) {
        newThetaY = this.originalAngles.thetaY + this.params.maxRotation;
      } else if (diffY < this.params.minRotation) {
        newThetaY = this.originalAngles.thetaY + this.params.minRotation;
      }

      this.params.thetaX = newThetaX;
      this.params.thetaY = newThetaY;

      // 0-360 범위로 정규화
      this.params.thetaX = (this.params.thetaX + 360) % 360;
      this.params.thetaY = (this.params.thetaY + 360) % 360;

      this.setObliqueProjection();
    }
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

  // === 그룹 이동 적용 ===
  applyTo(group) {
    group.position.copy(this.panOffset);
  }

  // === 업데이트 루프 ===
  update(group) {
    this.applyTo(group);
  }

  // === 정리 ===
  dispose() {
    this.domElement.removeEventListener("mousedown", this._onMouseDown);
    this.domElement.removeEventListener("wheel", this._onWheel);
    window.removeEventListener("mouseup", this._onMouseUp);
    window.removeEventListener("mousemove", this._onMouseMove);
  }
}
