import * as THREE from "three";
import { GRID_CONFIG } from "../config/grid";
import type { PlacedObject } from "../config/types";

/**
 * 건물 그라데이션을 미리 계산하여 텍스처로 생성
 *
 * 건물 위치는 고정이므로, 월드 공간의 그리드에 그라데이션을 미리 계산
 * 카메라가 움직이면 offset만 적용하여 효율적으로 렌더링
 */
export function generateGradientTexture(
  buildings: PlacedObject[],
  textureSize: number = 512,
  worldBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
  influenceRadius: number = GRID_CONFIG.CURSOR_INFLUENCE_RADIUS,
  isDarkMode: boolean = true
): THREE.DataTexture {
  const data = new Float32Array(textureSize * textureSize * 4); // RGBA
  const { minX, maxX, minZ, maxZ } = worldBounds;

  const worldWidth = maxX - minX;
  const worldDepth = maxZ - minZ;

  // 그라데이션 색상
  const lightColors = {
    l1: [0.95, 0.96, 0.98],
    l2: [0.9, 0.92, 0.95],
    l3: [0.85, 0.88, 0.92],
    l4: [0.8, 0.82, 0.85],
  };

  const darkColors = {
    d1: [0.35, 0.36, 0.38],
    d2: [0.3, 0.32, 0.35],
    d3: [0.25, 0.28, 0.32],
    d4: [0.2, 0.22, 0.25],
  };

  // 각 픽셀에 대해 그라데이션 계산
  for (let y = 0; y < textureSize; y++) {
    for (let x = 0; x < textureSize; x++) {
      const worldX = minX + (x / textureSize) * worldWidth;
      const worldZ = minZ + (y / textureSize) * worldDepth;
      const worldPos = [worldX, worldZ];

      let finalColor = isDarkMode ? [0.02, 0.02, 0.02] : [0.96, 0.96, 0.96];
      let maxAlpha = 0.0;

      // 모든 건물에 대해 그라데이션 계산
      for (const building of buildings) {
        const buildingPos = [building.position[0], building.position[2]];
        const dist = Math.sqrt(
          Math.pow(worldPos[0] - buildingPos[0], 2) +
            Math.pow(worldPos[1] - buildingPos[1], 2)
        );

        if (dist >= influenceRadius) continue;

        // 그라데이션 계산
        const normalizedDist = dist / influenceRadius;
        const t1 = Math.max(0, Math.min(1, (normalizedDist - 0.0) / 0.3));
        const t2 = Math.max(0, Math.min(1, (normalizedDist - 0.3) / 0.3));
        const t3 = Math.max(0, Math.min(1, (normalizedDist - 0.6) / 0.4));

        const color1 = isDarkMode ? darkColors.d1 : lightColors.l1;
        const color2 = isDarkMode ? darkColors.d2 : lightColors.l2;
        const color3 = isDarkMode ? darkColors.d3 : lightColors.l3;
        const color4 = isDarkMode ? darkColors.d4 : lightColors.l4;

        const c1 = [
          color1[0] + (color2[0] - color1[0]) * t1,
          color1[1] + (color2[1] - color1[1]) * t1,
          color1[2] + (color2[2] - color1[2]) * t1,
        ];
        const c2 = [
          c1[0] + (color3[0] - c1[0]) * t2,
          c1[1] + (color3[1] - c1[1]) * t2,
          c1[2] + (color3[2] - c1[2]) * t2,
        ];
        const gradientColor = [
          c2[0] + (color4[0] - c2[0]) * t3,
          c2[1] + (color4[1] - c2[1]) * t3,
          c2[2] + (color4[2] - c2[2]) * t3,
        ];

        const falloff =
          1.0 - Math.max(0, Math.min(1, (normalizedDist - 0.5) / 0.5));
        const alpha = falloff * 0.4; // 건물 그라데이션 강도

        // Alpha blending
        finalColor = [
          finalColor[0] * (1 - alpha) + gradientColor[0] * alpha,
          finalColor[1] * (1 - alpha) + gradientColor[1] * alpha,
          finalColor[2] * (1 - alpha) + gradientColor[2] * alpha,
        ];
        maxAlpha = Math.max(maxAlpha, alpha);
      }

      const idx = (y * textureSize + x) * 4;
      data[idx] = finalColor[0];
      data[idx + 1] = finalColor[1];
      data[idx + 2] = finalColor[2];
      data[idx + 3] = maxAlpha; // Alpha 채널에 그라데이션 강도 저장
    }
  }

  const texture = new THREE.DataTexture(
    data,
    textureSize,
    textureSize,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = false; // 메모리 최적화: mipmap 생성 비활성화
  texture.needsUpdate = true;

  return texture;
}

/**
 * 건물 목록으로부터 월드 바운드 계산
 */
export function calculateWorldBounds(
  buildings: PlacedObject[],
  padding: number = 50
): { minX: number; maxX: number; minZ: number; maxZ: number } {
  if (buildings.length === 0) {
    return { minX: -padding, maxX: padding, minZ: -padding, maxZ: padding };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  buildings.forEach((building) => {
    minX = Math.min(minX, building.position[0]);
    maxX = Math.max(maxX, building.position[0]);
    minZ = Math.min(minZ, building.position[2]);
    maxZ = Math.max(maxZ, building.position[2]);
  });

  // 패딩 추가
  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minZ: minZ - padding,
    maxZ: maxZ + padding,
  };
}
