import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
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
  const updateFromEvent = useMousePositionStore(
    (state) => state.updateFromEvent
  );
  const clearMousePosition = useMousePositionStore(
    (state) => state.clearMousePosition
  );

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

  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 건물 더블클릭 → 상세 페이지로 이동
  const handleBuildingDoubleClick = useCallback(
    (buildingId: string) => {
      navigate(`/details/${buildingId}`);
    },
    [navigate]
  );

  return (
    <div className="w-screen h-screen">
      <Canvas shadows gl={{ antialias: true }}>
        <Stats />
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
          isDarkMode={isDarkMode}
        />
      </Canvas>

      {/* 가장자리 영역 인디케이터 */}
      <EdgeZoneIndicator edgeZone={edgeZone} />

      {/* UI 오버레이 */}
      <div className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            🏙️ 아이소메트릭 도시
          </h1>
          <p className="text-sm text-gray-600">
            빈 셀을 클릭하여 건물을 추가하세요
          </p>
          <div className="text-xs text-gray-400 mt-1">
            우클릭 드래그: 이동 | 휠: 줌
          </div>
        </div>

        {/* 다크모드 토글 버튼 */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`
            p-2 rounded-full transition-colors duration-200
            ${
              isDarkMode
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }
          `}
          title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {isDarkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-011.33-4.968 1.56 1.56 0 00-1.885.566A11.955 11.955 0 002.25 12c0 6.627 5.373 12 12 12 5.06 0 9.293-3.088 11.12-7.464a1.562 1.562 0 00-1.618-1.534z"
              />
            </svg>
          )}
        </button>
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
