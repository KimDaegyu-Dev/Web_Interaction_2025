import { useRef, useMemo } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ROOM_HEIGHT } from "../../config/constants";
import { screenToWorldCoords } from "../../utils/projection";
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
  onCellPointerOver,
  onCellPointerOut,
  onCellClick,
  hoveredCell,
  isShiftPressed,
}: GridFloorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  // 고정된 그리드 셀 생성 (뷰포트 크기만큼)
  const cells = useMemo(() => {
    const result: Array<{ x: number; z: number }> = [];
    const halfSize = (viewportGridSize * gridSize) / 2;

    for (let x = -halfSize + gridSize / 2; x < halfSize; x += gridSize) {
      for (let z = -halfSize + gridSize / 2; z < halfSize; z += gridSize) {
        result.push({ x, z });
      }
    }
    return result;
  }, [gridSize, viewportGridSize]);

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

  return (
    <group position={[0, -ROOM_HEIGHT / 2 + 0.01, 0]}>
      <group ref={groupRef}>
        {/* 베이스 Floor - 그리드와 함께 이동 */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry
            args={[
              viewportGridSize * gridSize * 2,
              viewportGridSize * gridSize * 2,
            ]}
          />
          <meshStandardMaterial
            color={0x1a1a1a}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* 그리드 셀들 */}
        {cells.map(({ x, z }) => {
          // 실제 월드 좌표 계산 (그룹의 위치 + 로컬 위치)
          const worldX = groupRef.current ? groupRef.current.position.x + x : x;
          const worldZ = groupRef.current ? groupRef.current.position.z + z : z;

          const isHovered =
            hoveredCell?.x === worldX &&
            hoveredCell?.z === worldZ &&
            isShiftPressed;

          return (
            <mesh
              key={`cell-${x}-${z}`}
              position={[x, 0, z]}
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                // e.point는 Oblique 변환이 적용된 좌표
                // 역변환하여 원본 월드 좌표로 되돌림
                const transformedPoint = e.point;
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
                onCellPointerOver(snappedX, snappedZ);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                onCellPointerOut();
              }}
              onClick={(e) => {
                e.stopPropagation();
                // e.point는 Oblique 변환이 적용된 좌표
                // 역변환하여 원본 월드 좌표로 되돌림
                const transformedPoint = e.point;
                let originalX = transformedPoint.x;
                let originalZ = transformedPoint.z;

                if (getObliqueMatrix) {
                  const inverseMatrix = getObliqueMatrix().clone().invert();
                  const originalPoint = transformedPoint
                    .clone()
                    .applyMatrix4(inverseMatrix);
                  originalX = originalPoint.x;
                  originalZ = originalPoint.z;
                  console.log("GridFloor click:", {
                    transformedPoint: {
                      x: transformedPoint.x,
                      y: transformedPoint.y,
                      z: transformedPoint.z,
                    },
                    originalPoint: {
                      x: originalPoint.x,
                      y: originalPoint.y,
                      z: originalPoint.z,
                    },
                    shiftKey: e.shiftKey,
                  });
                }

                const snappedX = Math.round(originalX / gridSize) * gridSize;
                const snappedZ = Math.round(originalZ / gridSize) * gridSize;
                console.log("Final coordinates:", { snappedX, snappedZ });
                onCellClick(e, snappedX, snappedZ);
              }}
            >
              <planeGeometry args={[gridSize * 0.95, gridSize * 0.95]} />
              <meshStandardMaterial
                color={isHovered ? 0x00ff88 : 0x2d3436}
                emissive={isHovered ? 0x00ff88 : 0x000000}
                emissiveIntensity={isHovered ? 0.3 : 0}
                roughness={0.8}
                metalness={0.2}
                transparent
                opacity={isHovered ? 0.8 : 0.3}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
