import * as THREE from "three";
import { ROOM_SIZE, ROOM_HEIGHT } from "../config/constants.js";

// 바닥 생성
export function createFloor() {
  const floorGeometry = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d3436,
    roughness: 0.8,
    metalness: 0.2,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -ROOM_HEIGHT / 2;
  floor.receiveShadow = true;

  return floor;
}

// 천장 생성
export function createCeiling() {
  const ceilingGeometry = new THREE.PlaneGeometry(ROOM_SIZE, ROOM_SIZE);
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x34495e,
    roughness: 0.9,
    metalness: 0.1,
  });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_HEIGHT / 2;
  ceiling.receiveShadow = true;

  return ceiling;
}

// 벽 4개 생성
export function createWalls() {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d5a80,
    roughness: 0.7,
    metalness: 0.3,
  });

  const walls = [];

  // 뒷벽
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_HEIGHT),
    wallMaterial
  );
  backWall.position.z = -ROOM_SIZE / 2;
  backWall.receiveShadow = true;
  walls.push(backWall);

  // 앞벽
  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_HEIGHT),
    wallMaterial
  );
  frontWall.position.z = ROOM_SIZE / 2;
  frontWall.rotation.y = Math.PI;
  frontWall.receiveShadow = true;
  walls.push(frontWall);

  // 왼쪽 벽
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_HEIGHT),
    wallMaterial
  );
  leftWall.position.x = -ROOM_SIZE / 2;
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  walls.push(leftWall);

  // 오른쪽 벽
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_SIZE, ROOM_HEIGHT),
    wallMaterial
  );
  rightWall.position.x = ROOM_SIZE / 2;
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  walls.push(rightWall);

  return walls;
}

// 전체 방 생성
export function createRoom(group) {
  group.add(createFloor());
  group.add(createCeiling());
  createWalls().forEach((wall) => group.add(wall));
}
