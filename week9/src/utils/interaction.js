import * as THREE from "three";

// 호버 인터랙션 관리 클래스
export class HoverInteraction {
  constructor(camera, objects) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.objects = objects;
    this.hoveredObject = null;
    
    this.setupMouseListener();
  }
  
  setupMouseListener() {
    window.addEventListener("mousemove", (event) => {
      // 마우스 좌표를 정규화된 디바이스 좌표로 변환 (-1 to +1)
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }
  
  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects, false);

    if (intersects.length > 0) {
      const newHovered = intersects[0].object;

      // 새로운 오브젝트에 호버
      if (this.hoveredObject !== newHovered) {
        // 이전 호버 오브젝트 복원
        if (this.hoveredObject) {
          this.hoveredObject.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
        // 새 오브젝트 크기 증가
        this.hoveredObject = newHovered;
      }
      // 부드러운 스케일 증가
      if (this.hoveredObject) {
        this.hoveredObject.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      }
    } else {
      // 호버 해제
      if (this.hoveredObject) {
        this.hoveredObject.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        if (this.hoveredObject.scale.x < 1.01) {
          this.hoveredObject.scale.set(1, 1, 1);
          this.hoveredObject = null;
        }
      }
    }
  }
}

