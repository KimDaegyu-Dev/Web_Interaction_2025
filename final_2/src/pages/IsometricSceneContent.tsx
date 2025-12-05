import { useRef, useCallback } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { IsometricCamera } from "@/three/cameras/IsometricCamera";
import { Lights } from "@/three/lights/Lights";
import { InfiniteBackground } from "@/three/components/Grid/InfiniteBackground";
import { InteractiveBuildings } from "@/three/components/DisplayObjects";
import { useIsometricControls } from "@/three/hooks/useIsometricControls";
import { GRID_CONFIG } from "@/three/config/grid";
import type { RoadSegment } from "@/three/utils/clusteringAlgorithm";
import type { OtherCursor } from "@/stores/cameraStore";
import type { PlacedObject } from "@/three/config/types";

interface IsometricSceneContentProps {
  placedObjects: PlacedObject[];
  cursors: OtherCursor[];
  myCursor: { gridX: number; gridZ: number } | null;
  roadSegments: RoadSegment[];
  hoveredPosition: [number, number, number] | null;
  selectedBuildingId: string | null;
  onCellPointerOver: (x: number, z: number) => void;
  onCellPointerOut: () => void;
  onCellClick: (e: ThreeEvent<MouseEvent>, x: number, y: number, z: number) => void;
  onBuildingClick: (e: ThreeEvent<MouseEvent>, id: string) => void;
  onBuildingDoubleClick: (id: string) => void;
  updateCursor: (x: number, z: number) => void;
  onEdgeZoneChange: (edgeZone: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  }) => void;
}

/**
 * Canvas 내부 씬 컨텐츠
 * useIsometricControls를 사용하여 패닝/줌 구현
 */
export function IsometricSceneContent({
  placedObjects,
  cursors,
  myCursor,
  roadSegments,
  hoveredPosition,
  selectedBuildingId,
  onCellPointerOver,
  onCellPointerOut,
  onCellClick,
  onBuildingClick,
  onBuildingDoubleClick,
  updateCursor,
  onEdgeZoneChange,
}: IsometricSceneContentProps) {
  const { getPanOffset, getEdgeZone } = useIsometricControls();
  const sceneGroupRef = useRef<THREE.Group>(null);
  const lastClickTimeRef = useRef<Map<string, number>>(new Map());

  // 매 프레임마다 패닝 오프셋 적용
  useFrame(() => {
    if (sceneGroupRef.current) {
      const offset = getPanOffset();
      sceneGroupRef.current.position.x = offset.x;
      sceneGroupRef.current.position.y = offset.y;
    }

    // 가장자리 영역 상태 업데이트
    const edgeZone = getEdgeZone();
    onEdgeZoneChange(edgeZone);
  });

  // 바닥 클릭 핸들러 (좌클릭만)
  const handleGroundClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      // 좌클릭만 처리
      if (e.nativeEvent.button !== 0) return;

      const point = e.point;
      const cellX = Math.floor(point.x / GRID_CONFIG.CELL_SIZE) * GRID_CONFIG.CELL_SIZE;
      const cellZ = Math.floor(point.z / GRID_CONFIG.CELL_SIZE) * GRID_CONFIG.CELL_SIZE;
      onCellClick(e, cellX, 0, cellZ);
      updateCursor(cellX + GRID_CONFIG.CELL_SIZE / 2, cellZ + GRID_CONFIG.CELL_SIZE / 2);
    },
    [onCellClick, updateCursor]
  );

  // 바닥 포인터 이동 핸들러
  const handleGroundPointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const point = e.point;
      const cellX = Math.floor(point.x / GRID_CONFIG.CELL_SIZE);
      const cellZ = Math.floor(point.z / GRID_CONFIG.CELL_SIZE);
      onCellPointerOver(cellX * GRID_CONFIG.CELL_SIZE, cellZ * GRID_CONFIG.CELL_SIZE);
      updateCursor(
        cellX * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2,
        cellZ * GRID_CONFIG.CELL_SIZE + GRID_CONFIG.CELL_SIZE / 2
      );
    },
    [onCellPointerOver, updateCursor]
  );

  // 건물 클릭 핸들러 (더블클릭 감지 포함)
  const handleBuildingClick = useCallback(
    (e: ThreeEvent<MouseEvent>, id: string) => {
      // 좌클릭만 처리
      if (e.nativeEvent.button !== 0) return;

      const now = Date.now();
      const lastClick = lastClickTimeRef.current.get(id) || 0;

      if (now - lastClick < 300) {
        // 더블클릭
        onBuildingDoubleClick(id);
      } else {
        // 싱글클릭
        onBuildingClick(e, id);
      }

      lastClickTimeRef.current.set(id, now);
    },
    [onBuildingClick, onBuildingDoubleClick]
  );

  return (
    <>
      {/* 카메라 */}
      <IsometricCamera position={[30, 30, 30]} zoom={40} />

      {/* 조명 */}
      <Lights />

      {/* 패닝 적용되는 씬 그룹 */}
      <group ref={sceneGroupRef}>
        {/* 무한 배경 + 도로 */}
        <InfiniteBackground
          buildings={placedObjects}
          cursors={cursors}
          myCursor={myCursor}
          roadSegments={roadSegments}
        />

        {/* 건물들 */}
        <InteractiveBuildings
          buildings={placedObjects}
          selectedBuildingId={selectedBuildingId}
          onBuildingClick={handleBuildingClick}
        />

        {/* 바닥 (클릭/호버 감지용) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          onClick={handleGroundClick}
          onPointerMove={handleGroundPointerMove}
          onPointerOut={onCellPointerOut}
        >
          <planeGeometry args={[500, 500]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
}
