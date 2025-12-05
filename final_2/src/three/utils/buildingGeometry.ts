import * as THREE from "three";
import type { BuildingStructureBox } from "@/utils/supabase";

// 부동소수점 비교용 epsilon
const EPSILON = 0.001;

/**
 * 바운딩 박스 타입
 */
export interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

/**
 * 점이 박스 내부에 있는지 확인 (경계 포함)
 */
export function isPointInsideBox(
  point: THREE.Vector3,
  box: BuildingStructureBox
): boolean {
  const [px, py, pz] = box.position;
  const [sx, sy, sz] = box.scale;

  const minX = px - sx / 2 - EPSILON;
  const maxX = px + sx / 2 + EPSILON;
  const minY = py - sy / 2 - EPSILON;
  const maxY = py + sy / 2 + EPSILON;
  const minZ = pz - sz / 2 - EPSILON;
  const maxZ = pz + sz / 2 + EPSILON;

  return (
    point.x >= minX &&
    point.x <= maxX &&
    point.y >= minY &&
    point.y <= maxY &&
    point.z >= minZ &&
    point.z <= maxZ
  );
}

/**
 * 엣지(선분)가 박스 내부에 완전히 포함되어 있는지 확인
 */
export function isEdgeInsideBox(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  box: BuildingStructureBox
): boolean {
  const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  return (
    isPointInsideBox(p1, box) &&
    isPointInsideBox(p2, box) &&
    isPointInsideBox(midPoint, box)
  );
}

/**
 * 박스의 12개 외곽 엣지 생성
 */
export function createBoxEdges(
  box: BuildingStructureBox
): Array<[THREE.Vector3, THREE.Vector3]> {
  const [px, py, pz] = box.position;
  const [sx, sy, sz] = box.scale;

  const hw = sx / 2;
  const hh = sy / 2;
  const hd = sz / 2;

  const v = [
    new THREE.Vector3(px - hw, py - hh, pz - hd),
    new THREE.Vector3(px + hw, py - hh, pz - hd),
    new THREE.Vector3(px + hw, py - hh, pz + hd),
    new THREE.Vector3(px - hw, py - hh, pz + hd),
    new THREE.Vector3(px - hw, py + hh, pz - hd),
    new THREE.Vector3(px + hw, py + hh, pz - hd),
    new THREE.Vector3(px + hw, py + hh, pz + hd),
    new THREE.Vector3(px - hw, py + hh, pz + hd),
  ];

  return [
    [v[0], v[1]],
    [v[1], v[2]],
    [v[2], v[3]],
    [v[3], v[0]],
    [v[4], v[5]],
    [v[5], v[6]],
    [v[6], v[7]],
    [v[7], v[4]],
    [v[0], v[4]],
    [v[1], v[5]],
    [v[2], v[6]],
    [v[3], v[7]],
  ];
}

/**
 * 여러 박스의 외곽 엣지를 합쳐서 BufferGeometry 생성
 * 다른 박스에 가려지는 엣지는 제외
 */
export function createBuildingEdgesGeometry(
  structure: BuildingStructureBox[]
): THREE.BufferGeometry {
  const visibleEdges: THREE.Vector3[] = [];

  structure.forEach((box, boxIndex) => {
    const edges = createBoxEdges(box);

    edges.forEach(([p1, p2]) => {
      let isHidden = false;

      for (let i = 0; i < structure.length; i++) {
        if (i === boxIndex) continue;
        if (isEdgeInsideBox(p1, p2, structure[i])) {
          isHidden = true;
          break;
        }
      }

      if (!isHidden) {
        visibleEdges.push(p1, p2);
      }
    });
  });

  const positions = new Float32Array(visibleEdges.length * 3);
  visibleEdges.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return geometry;
}

/**
 * 건물 구조에서 바운딩 박스 계산
 */
export function calculateBoundingBox(
  structure: BuildingStructureBox[]
): BoundingBox {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;

  structure.forEach((box) => {
    const [px, py, pz] = box.position;
    const [sx, sy, sz] = box.scale;

    minX = Math.min(minX, px - sx / 2);
    maxX = Math.max(maxX, px + sx / 2);
    minY = Math.min(minY, py - sy / 2);
    maxY = Math.max(maxY, py + sy / 2);
    minZ = Math.min(minZ, pz - sz / 2);
    maxZ = Math.max(maxZ, pz + sz / 2);
  });

  return { minX, maxX, minY, maxY, minZ, maxZ };
}

/**
 * 바운딩 박스의 중심점 계산
 */
export function getBoundingBoxCenter(bbox: BoundingBox): THREE.Vector3 {
  return new THREE.Vector3(
    (bbox.minX + bbox.maxX) / 2,
    (bbox.minY + bbox.maxY) / 2,
    (bbox.minZ + bbox.maxZ) / 2
  );
}

/**
 * 바운딩 박스의 크기 계산
 */
export function getBoundingBoxSize(bbox: BoundingBox): THREE.Vector3 {
  return new THREE.Vector3(
    bbox.maxX - bbox.minX,
    bbox.maxY - bbox.minY,
    bbox.maxZ - bbox.minZ
  );
}
