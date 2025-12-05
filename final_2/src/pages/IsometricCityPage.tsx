import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { EdgeZoneIndicator } from "@/three/components/EdgeZoneIndicator";
import { useGridInteraction } from "@/three/hooks/useGridInteraction";
import { useRealtimeCursors } from "@/three/hooks/useRealtimeCursors";
import { useRoadClustering } from "@/three/hooks/useRoadClustering";
import { BuildingModal } from "@/components/BuildingModal";
import { GRID_CONFIG } from "@/three/config/grid";
import { useMousePositionStore } from "@/stores/mousePositionStore";
import { IsometricSceneContent } from "./IsometricSceneContent";

/**
 * 메인 아이소메트릭 도시 그리드 페이지
 * 
 * 인터랙션:
 * - 좌클릭: 건물 배치 / 선택
 * - 우클릭 드래그: 맵 패닝 (이동)
 * - 마우스 휠: 줌 인/아웃
 * - 가장자리 호버: 자동 스크롤 (조이스틱 방식)
 */
export function IsometricCityPage() {
  const navigate = useNavigate();
  
  // 전역 마우스 위치 상태
  const updateFromEvent = useMousePositionStore((state) => state.updateFromEvent);
  const clearMousePosition = useMousePositionStore((state) => state.clearMousePosition);
  
  // 마우스 이벤트 리스너 등록 (가장자리 스크롤 중에도 호버 감지)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateFromEvent(e);
    };
    
    const handleMouseLeave = () => {
      clearMousePosition();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updateFromEvent, clearMousePosition]);
  
  // 가장자리 영역 상태 (UI 인디케이터용)
  const [edgeZone, setEdgeZone] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  // 그리드 인터랙션
  const {
    hoveredCell,
    selectedBuildingId,
    selectedBuilding,
    modalMode,
    error,
    placedObjects,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    setModalMode,
    confirmCreate,
    confirmDelete,
    closeModal,
  } = useGridInteraction();

  // 실시간 커서
  const { cursors, myCursor, updateCursor } = useRealtimeCursors();

  // 도로 클러스터링 (개선된 버전)
  const { roadSegments } = useRoadClustering(placedObjects);

  // 건물 더블클릭 → 상세 페이지로 이동
  const handleBuildingDoubleClick = useCallback((buildingId: string) => {
    navigate(`/details/${buildingId}`);
  }, [navigate]);

  return (
    <div className="w-screen h-screen">
      <Canvas shadows gl={{ antialias: true }}>
        <IsometricSceneContent
          placedObjects={placedObjects}
          cursors={cursors}
          myCursor={myCursor}
          roadSegments={roadSegments}
          onCellPointerOver={onCellPointerOver}
          onCellPointerOut={onCellPointerOut}
          onCellClick={onCellClick}
          onBuildingNavigate={handleBuildingDoubleClick}
          updateCursor={updateCursor}
          onEdgeZoneChange={setEdgeZone}
        />
      </Canvas>

      {/* 가장자리 영역 인디케이터 */}
      <EdgeZoneIndicator edgeZone={edgeZone} />

      {/* UI 오버레이 */}
      <div className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <h1 className="text-lg font-bold text-gray-800">🏙️ 아이소메트릭 도시</h1>
        <p className="text-sm text-gray-600">
          빈 셀을 클릭하여 건물을 추가하세요
        </p>
        <div className="text-xs text-gray-400 mt-1">
          우클릭 드래그: 이동 | 휠: 줌
        </div>
      </div>

      {/* 건물 모달 */}
      {modalMode && (
        <BuildingModal
          mode={modalMode}
          building={selectedBuilding}
          onConfirm={confirmCreate}
          onDelete={confirmDelete}
          onClose={closeModal}
          error={error}
        />
      )}
    </div>
  );
}
