import { useRef } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { ROOM_HEIGHT } from "../../config/constants";
import * as THREE from "three";

interface GridFloorProps {
  gridSize?: number;
  viewportGridSize?: number; // 뷰포트 주변에 그릴 그리드 개수
  getPanOffset?: () => THREE.Vector3; // panOffset을 가져오는 함수
  getObliqueMatrix?: () => THREE.Matrix4; // Oblique 투영 행렬 생성 함수 (역변환용)
  onCellPointerOver: (x: number, z: number) => void;
  onCellPointerOut: () => void;
  onCellClick: (e: ThreeEvent<MouseEvent>, x: number, z: number) => void;
  hoveredCell: { x: number; z: number } | null;
  isShiftPressed: boolean;
}

export function GridFloor({
  gridSize = 1,
  viewportGridSize = 30, // 카메라 주변 30x30 그리드만 렌더링
  getPanOffset,
  getObliqueMatrix,
  onCellPointerOver: _onCellPointerOver, // Scene에서 직접 처리하므로 사용하지 않음
  onCellPointerOut: _onCellPointerOut, // Scene에서 직접 처리하므로 사용하지 않음
  onCellClick,
  hoveredCell: _hoveredCell, // Scene에서 직접 처리하므로 사용하지 않음
  isShiftPressed: _isShiftPressed, // Scene에서 직접 처리하므로 사용하지 않음
}: GridFloorProps) {
  const groupRef = useRef<THREE.Group>(null);

  // panOffset을 따라 그리드 이동
  useFrame(() => {
    if (groupRef.current && getPanOffset) {
      const panOffset = getPanOffset();

      // 그리드를 panOffset에 맞춰 스냅 (그리드 크기 단위로)
      // panOffset은 음수이므로 부호를 반대로
      const snappedX = Math.round(-panOffset.x / gridSize) * gridSize;
      const snappedZ = Math.round(-panOffset.y / gridSize) * gridSize;

      groupRef.current.position.x = snappedX;
      groupRef.current.position.z = snappedZ;
    }
  });

  // 마우스 위치를 그리드 좌표로 변환하는 헬퍼 함수 (클릭용)
  const convertPointToGridCoords = (
    transformedPoint: THREE.Vector3,
  ): { x: number; z: number } => {
    let originalX = transformedPoint.x;
    let originalZ = transformedPoint.z;

    if (getObliqueMatrix) {
      const inverseMatrix = getObliqueMatrix().clone().invert();
      const originalPoint = transformedPoint
        .clone()
        .applyMatrix4(inverseMatrix);
      originalX = originalPoint.x;
      originalZ = originalPoint.z;
    }

    const snappedX = Math.round(originalX / gridSize) * gridSize;
    const snappedZ = Math.round(originalZ / gridSize) * gridSize;
    return { x: snappedX, z: snappedZ };
  };

  return (
    <group position={[0, -ROOM_HEIGHT / 2 + 0.01, 0]}>
      <group ref={groupRef}>
        {/* 클릭 이벤트용 투명한 평면 - 보이지 않지만 클릭 감지용 */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            const gridCoords = convertPointToGridCoords(e.point);
            onCellClick(e, gridCoords.x, gridCoords.z);
          }}
        >
          <planeGeometry
            args={[
              viewportGridSize * gridSize * 2,
              viewportGridSize * gridSize * 2,
            ]}
          />
          <meshStandardMaterial transparent opacity={0} visible={false} />
        </mesh>
      </group>
    </group>
  );
}
