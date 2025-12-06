import { useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IsometricCamera } from "@/three/cameras/IsometricCamera";
import { Lights } from "@/three/lights/Lights";
import { InfiniteBackground } from "@/three/components/Grid/InfiniteBackground";
import { InteractiveBuildings } from "@/three/components/DisplayObjects";
import { RealtimeCursors } from "@/three/components/RealtimeCursors";
import { RoadMeshRenderer } from "@/three/components/Road/RoadMeshRenderer";
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
  onCellPointerOver: (x: number, z: number) => void;
  onCellPointerOut: () => void;
  onCellClick: (onBuildingNavigate?: (id: string) => void) => void;
  onBuildingNavigate: (id: string) => void;
  updateCursor: (x: number, z: number) => void;
  onEdgeZoneChange: (edgeZone: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  }) => void;
  isDarkMode: boolean;
  enableGradients?: boolean; // 그라데이션 토글
}

/**
 * Canvas 내부 씬 컨텐츠
 * useMouseControls (RxJS 기반)를 사용하여 모든 마우스 인터랙션 처리
 * - 좌클릭: onCellClick (건물 클릭/빈 셀 클릭 통합)
 * - 우클릭 드래그: 맵 패닝
 * - 휠: 줌
 * - 가장자리 호버: 자동 스크롤
 */
export function IsometricSceneContent({
  placedObjects,
  cursors,
  myCursor,
  roadSegments,
  onCellPointerOver,
  onCellPointerOut,
  onCellClick,
  onBuildingNavigate,
  updateCursor,
  onEdgeZoneChange,
  isDarkMode,
  enableGradients = true, // 기본값: 활성화
}: IsometricSceneContentProps) {
  const sceneGroupRef = useRef<THREE.Group>(null);

  // 전역 마우스 위치 상태
  const mousePosition = useMousePositionStore((state) => state.mousePosition);

  // 투영 파라미터 (기본 Isometric)
  const projectionParams = DEFAULT_PROJECTION_PARAMS;

  // 클릭 핸들러 - RxJS leftClick$ 스트림에서 호출됨
  const handleLeftClick = useCallback(() => {
    // onCellClick이 내부에서 hoveredCell을 참조하여 처리
    onCellClick(onBuildingNavigate);
  }, [onCellClick, onBuildingNavigate]);

  // RxJS 기반 마우스 컨트롤 (좌클릭 콜백 포함)
  const { getPanOffset, getEdgeZone } = useMouseControls({
    onLeftClick: handleLeftClick,
  });

  // Oblique 투영 적용
  useObliqueProjection(sceneGroupRef, projectionParams, getPanOffset);

  // 매 프레임 레이캐스팅으로 그리드 호버 처리
  useGridRaycasting({
    mousePosition,
    projectionParams,
    getPanOffset,
    onCellPointerOver: (x, z) => {
      onCellPointerOver(x, z);
      updateCursor(
        x + GRID_CONFIG.CELL_SIZE / 2,
        z + GRID_CONFIG.CELL_SIZE / 2
      );
    },
    onCellPointerOut,
  });

  // 매 프레임마다 가장자리 영역 상태 업데이트
  useFrame(() => {
    const edgeZone = getEdgeZone();
    onEdgeZoneChange(edgeZone);
  });

  // 도로 세그먼트 수 로깅
  // useEffect(() => {
  //   if (roadSegments.length > 0) {
  //     console.log(`[RoadSegments] Total: ${roadSegments.length} segments`);
  //   }
  // }, [roadSegments.length]);

  return (
    <>
      {/* 카메라 */}
      <IsometricCamera position={[30, 30, 30]} zoom={40} />

      {/* 조명 */}
      <Lights />

      {/* 패닝 적용되는 씬 그룹 (Oblique 투영) */}
      <group ref={sceneGroupRef}>
        {/* 건물들 */}
        <InteractiveBuildings buildings={placedObjects} />

        {/* 도로 (3D 메시로 렌더링 - GPU 자동 최적화) */}
        <RoadMeshRenderer
          roadSegments={roadSegments}
          isDarkMode={isDarkMode}
          maxSegments={500} // 성능 제한
        />

        {/* 실시간 커서 (내 커서 + 다른 사용자 커서) */}
        <RealtimeCursors cursors={cursors} myCursor={myCursor} />

        {/* 바닥 (투명, 클릭은 RxJS에서 처리) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
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
        isDarkMode={isDarkMode}
        enableGradients={enableGradients}
      />
    </>
  );
}
