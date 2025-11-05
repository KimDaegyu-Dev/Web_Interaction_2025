import * as THREE from "three";
import { ROOM_SIZE, ROOM_HEIGHT, PATTERN_SIZE } from "../config/constants.js";

// 바닥 패턴 생성
export function createFloorPattern(group) {
  for (let x = -ROOM_SIZE / 2; x < ROOM_SIZE / 2; x += PATTERN_SIZE) {
    for (let z = -ROOM_SIZE / 2; z < ROOM_SIZE / 2; z += PATTERN_SIZE) {
      if (
        (Math.floor(x / PATTERN_SIZE) + Math.floor(z / PATTERN_SIZE)) % 2 ===
        0
      ) {
        const tile = new THREE.Mesh(
          new THREE.PlaneGeometry(PATTERN_SIZE, PATTERN_SIZE),
          new THREE.MeshStandardMaterial({
            color: 0x1e272e,
            roughness: 0.9,
            metalness: 0.1,
          })
        );
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(
          x + PATTERN_SIZE / 2,
          -ROOM_HEIGHT / 2 + 0.01,
          z + PATTERN_SIZE / 2
        );
        tile.receiveShadow = true;
        group.add(tile);
      }
    }
  }
}

// 액자 생성
export function createFrame(xPosition, zPosition) {
  const frameGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    metalness: 0.5,
    roughness: 0.5,
  });

  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(xPosition, 0.5, zPosition);
  frame.castShadow = true;

  return frame;
}

// 액자 내부 그림 생성
export function createArtwork(xPosition, zPosition, color) {
  const artMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.3,
  });
  const art = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.8), artMaterial);
  art.position.set(xPosition, 0.5, zPosition);

  return art;
}

// 벽 액자들 생성
export function createWallArt(group) {
  // 뒷벽 액자 2개
  const frame1 = createFrame(-2, -ROOM_SIZE / 2 + 0.05);
  const frame2 = createFrame(2, -ROOM_SIZE / 2 + 0.05);

  const art1 = createArtwork(-2, -ROOM_SIZE / 2 + 0.11, 0xe74c3c);
  const art2 = createArtwork(2, -ROOM_SIZE / 2 + 0.11, 0x3498db);

  group.add(frame1, frame2, art1, art2);
}

// 천장 조명 장식 생성
export function createLightFixture() {
  const lightFixture = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xfff5e1,
      emissive: 0xfff5e1,
      emissiveIntensity: 1,
    })
  );
  lightFixture.position.set(0, 2, 0);

  return lightFixture;
}

// 방 모서리 기둥 생성
export function createPillars(group) {
  const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.15, ROOM_HEIGHT, 8);
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0x34495e,
    metalness: 0.4,
    roughness: 0.6,
  });

  const pillarPositions = [
    [-ROOM_SIZE / 2 + 0.2, 0, -ROOM_SIZE / 2 + 0.2],
    [ROOM_SIZE / 2 - 0.2, 0, -ROOM_SIZE / 2 + 0.2],
    [-ROOM_SIZE / 2 + 0.2, 0, ROOM_SIZE / 2 - 0.2],
    [ROOM_SIZE / 2 - 0.2, 0, ROOM_SIZE / 2 - 0.2],
  ];

  pillarPositions.forEach((pos) => {
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.set(...pos);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);
  });
}

// 모든 장식 요소 생성
export function createDecorations(group) {
  createFloorPattern(group);
  createWallArt(group);
  group.add(createLightFixture());
  createPillars(group);
}
