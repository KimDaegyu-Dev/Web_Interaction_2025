import { useRef, useCallback, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { IsometricCamera } from "@/three/cameras/IsometricCamera";
import { Lights } from "@/three/lights/Lights";
import { InfiniteBackground } from "@/three/components/Grid/InfiniteBackground";
import { InteractiveBuildings } from "@/three/components/DisplayObjects";
import { RealtimeCursors } from "@/three/components/RealtimeCursors";
import { useMouseControls } from "@/three/hooks/useMouseControls";
import { useObliqueProjection } from "@/three/hooks/useObliqueProjection";
import { useGridRaycasting } from "@/three/hooks/useGridRaycasting";
import { GRID_CONFIG } from "@/three/config/grid";
import { DEFAULT_PROJECTION_PARAMS } from "@/three/config/presets";
import { useMousePositionStore } from "@/stores/mousePositionStore";
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
 * useMouseControls (RxJS 기반)를 사용하여 패닝/줌 구현
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
  const { getPanOffset, getEdgeZone } = useMouseControls();
  const sceneGroupRef = useRef<THREE.Group>(null);
  const lastClickTimeRef = useRef<Map<string, number>>(new Map());
  
  // 전역 마우스 위치 상태
  const mousePosition = useMousePositionStore((state) => state.mousePosition);
  
  // 투영 파라미터 (기본 Isometric)
  const projectionParams = DEFAULT_PROJECTION_PARAMS;

  // Oblique 투영 적용
  useObliqueProjection(sceneGroupRef, projectionParams, getPanOffset);

  // 매 프레임 레이캐스팅으로 그리드 호버 처리
  useGridRaycasting({
    mousePosition,
    projectionParams,
    getPanOffset,
    onCellPointerOver: (x, z) => {
      onCellPointerOver(x, z);
      updateCursor(x + GRID_CONFIG.CELL_SIZE / 2, z + GRID_CONFIG.CELL_SIZE / 2);
    },
    onCellPointerOut,
  });

  // 매 프레임마다 가장자리 영역 상태 업데이트
  useFrame(() => {
    const edgeZone = getEdgeZone();
    onEdgeZoneChange(edgeZone);
  });

  // 바닥 클릭 핸들러 (좌클릭만) - 레이케스팅 기반
  const handleGroundClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      // 좌클릭만 처리
      if (e.nativeEvent.button !== 0) return;

      // 이미 useGridRaycasting에서 계산된 hoveredPosition 사용
      if (hoveredPosition) {
        const [cellX, , cellZ] = hoveredPosition;
        onCellClick(e, cellX, 0, cellZ);
      }
    },
    [hoveredPosition, onCellClick]
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

      {/* 패닝 적용되는 씬 그룹 (Oblique 투영) */}
      <group ref={sceneGroupRef}>
        {/* 건물들 */}
        <InteractiveBuildings
          buildings={placedObjects}
          selectedBuildingId={selectedBuildingId}
          onBuildingClick={handleBuildingClick}
        />

        {/* 실시간 커서 (내 커서 + 다른 사용자 커서) */}
        <RealtimeCursors
          cursors={cursors}
          myCursor={myCursor}
        />

        {/* 바닥 (클릭 감지용) - 호버는 useGridRaycasting에서 처리 */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          onClick={handleGroundClick}
        >
          <planeGeometry args={[500, 500]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* 무한 배경 (Oblique 역행렬 적용) - 씬 그룹 외부에서 렌더링 */}
      <InfiniteBackground
        buildings={placedObjects}
        cursors={cursors}
        myCursor={myCursor}
        roadSegments={roadSegments}
        projectionParams={projectionParams}
        getPanOffset={getPanOffset}
      />
    </>
  );
}
