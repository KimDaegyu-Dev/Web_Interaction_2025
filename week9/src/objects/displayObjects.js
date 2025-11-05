import * as THREE from "three";

// 메인 큐브 생성
export function createCube() {
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

  return cube;
}

// 두 번째 큐브 생성
export function createCube2() {
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

  return cube2;
}

// 받침대 생성
export function createPedestal(zPosition = 0) {
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.8, 0.3, 32),
    new THREE.MeshStandardMaterial({
      color: 0x95a5a6,
      metalness: 0.8,
      roughness: 0.2,
    })
  );
  pedestal.position.y = -1;
  pedestal.position.z = zPosition;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;

  return pedestal;
}

// 전시 오브젝트들 생성 및 추가
export function createDisplayObjects(group) {
  const cube = createCube();
  const cube2 = createCube2();
  const pedestal = createPedestal();
  const pedestal2 = createPedestal(3);

  group.add(cube);
  group.add(cube2);
  group.add(pedestal);
  group.add(pedestal2);

  return { cube, cube2, pedestal, pedestal2 };
}
