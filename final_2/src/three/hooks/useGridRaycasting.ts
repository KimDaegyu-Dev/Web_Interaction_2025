import { useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  transformRayToOriginalSpace,
  intersectRayWithFloorPlane,
  worldToGridCoords,
} from "../utils/raycasting";
import { calculateObliqueMatrix } from "../utils/projection";
import type { ProjectionParams } from "../config/types";

interface UseGridRaycastingOptions {
  mousePosition: { x: number; y: number } | null;
  projectionParams: ProjectionParams;
  getPanOffset: () => THREE.Vector3;
  onCellPointerOver: (x: number, z: number) => void;
  onCellPointerOut: () => void;
}

/**
 * 마우스 위치를 추적하여 그리드 셀 호버를 처리하는 훅
 * 매 프레임마다 레이캐스팅을 수행하여 가장자리 스크롤 중에도 호버 업데이트
 */
export function useGridRaycasting({
  mousePosition,
  projectionParams,
  getPanOffset,
  onCellPointerOver,
  onCellPointerOut,
}: UseGridRaycastingOptions) {
  const { camera, gl } = useThree();
  const lastGridCoordsRef = useRef<{ x: number; z: number } | null>(null);

  const getObliqueMatrix = useCallback(() => {
    const panOffset = getPanOffset();
    return calculateObliqueMatrix(projectionParams, panOffset);
  }, [projectionParams, getPanOffset]);

  useFrame(() => {
    if (!mousePosition) {
      if (lastGridCoordsRef.current) {
        lastGridCoordsRef.current = null;
        onCellPointerOut();
      }
      return;
    }

    // 정규화된 디바이스 좌표로 변환
    const rect = gl.domElement.getBoundingClientRect();
    const ndcX = ((mousePosition.x - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((mousePosition.y - rect.top) / rect.height) * 2 + 1;

    // Ray 생성
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

    // Oblique 투영 행렬
    const obliqueMatrix = getObliqueMatrix();
    const inverseMatrix = obliqueMatrix.clone().invert();

    // Ray를 원본 좌표계로 변환
    const { origin, direction } = transformRayToOriginalSpace(
      raycaster.ray,
      inverseMatrix,
    );

    // 바닥 평면과의 교점 계산
    const intersectPoint = intersectRayWithFloorPlane(origin, direction);

    if (intersectPoint) {
      // 그리드 좌표로 변환
      const gridCoords = worldToGridCoords(intersectPoint);

      // 이전 좌표와 비교하여 변경된 경우에만 업데이트
      if (
        !lastGridCoordsRef.current ||
        lastGridCoordsRef.current.x !== gridCoords.x ||
        lastGridCoordsRef.current.z !== gridCoords.z
      ) {
        lastGridCoordsRef.current = gridCoords;
        onCellPointerOver(gridCoords.x, gridCoords.z);
      }
    } else {
      // 교점이 없으면 호버 해제
      if (lastGridCoordsRef.current) {
        lastGridCoordsRef.current = null;
        onCellPointerOut();
      }
    }
  });
}
