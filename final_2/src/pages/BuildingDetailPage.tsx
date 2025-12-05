import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Lights } from "@/three/lights/Lights";
import { BuildingModel } from "@/three/components/DisplayObjects/BuildingModel";
import { WreathPhysics } from "@/three/components/Wreath";
import { useWreathPersistence } from "@/three/hooks/useWreathPersistence";
import { useBuildingPersistence } from "@/three/hooks/useBuildingPersistence";
import { WreathModal } from "@/components/WreathModal";

// 화환 텍스처 경로 (public 폴더에 배치)
const WREATH_TEXTURE_URL = "/textures/wreath.png";

/**
 * 건물 상세 페이지
 * OrthographicCamera로 2D 시점 구현
 * 화환 물리 시뮬레이션 포함
 */
export function BuildingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [showWreathModal, setShowWreathModal] = useState(false);
  
  // 건물 데이터 로드
  const { buildings, isLoading: buildingLoading } = useBuildingPersistence();
  const building = buildings.find((b) => b.id === id);

  // 화환 데이터 로드
  const {
    wreaths,
    isLoading: wreathLoading,
    createWreath,
    updateWreathPosition,
  } = useWreathPersistence(id || null);

  // 화환 드롭 완료 핸들러 (최종 위치 저장)
  const handleWreathDropComplete = useCallback(
    async (wreathId: string, finalPosition: [number, number, number]) => {
      console.log(`[Wreath] Drop complete: ${wreathId}`, finalPosition);
      await updateWreathPosition(wreathId, finalPosition);
    },
    [updateWreathPosition]
  );

  // 화환 생성 핸들러
  const handleCreateWreath = useCallback(
    async (message: string, sender: string) => {
      await createWreath(message, sender);
      setShowWreathModal(false);
    },
    [createWreath]
  );

  // 건물이 없으면 메인으로 리다이렉트
  useEffect(() => {
    if (!buildingLoading && !building && id) {
      console.warn(`Building ${id} not found, redirecting...`);
      // navigate("/");
    }
  }, [building, buildingLoading, id, navigate]);

  if (buildingLoading || !building) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">건물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex">
      {/* 3D Canvas (2D 시점) */}
      <div className="flex-1 relative">
        <Canvas shadows>
          {/* OrthographicCamera - 정면 2D 시점 */}
          <OrthographicCamera
            makeDefault
            position={[0, 5, 20]}
            zoom={50}
            near={0.1}
            far={100}
          />

          {/* 조명 */}
          <Lights />

          {/* 배경색 */}
          <color attach="background" args={["#f5f5f5"]} />

          {/* 건물 모델 */}
          <BuildingModel
            id={building.id}
            position={[0, 0, 0]}
            meshIndex={building.meshIndex}
            buildingStructure={building.buildingStructure}
            buildingText={building.buildingText}
          />

          {/* 화환 물리 시뮬레이션 */}
          {wreaths.length > 0 && (
            <WreathPhysics
              wreaths={wreaths}
              textureUrl={WREATH_TEXTURE_URL}
              onWreathDropComplete={handleWreathDropComplete}
            />
          )}

          {/* 바닥 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#e8e8e8" />
          </mesh>
        </Canvas>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
        >
          ← 목록으로
        </button>
      </div>

      {/* 사이드 패널 */}
      <div className="w-96 bg-white shadow-lg p-6 overflow-y-auto">
        {/* 건물 정보 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {building.title || "이름 없는 건물"}
          </h1>
          {building.author && (
            <p className="text-gray-600">by {building.author}</p>
          )}
          {building.buildingText && (
            <p className="mt-4 text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4">
              "{building.buildingText}"
            </p>
          )}
        </div>

        {/* 화환 보내기 버튼 */}
        <button
          onClick={() => setShowWreathModal(true)}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg"
        >
          🎉 축하 화환 보내기
        </button>

        {/* 화환 목록 */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            받은 화환 ({wreaths.length}개)
          </h2>
          
          {wreaths.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              아직 받은 화환이 없습니다.<br />
              첫 번째 화환을 보내보세요! 🌸
            </p>
          ) : (
            <div className="space-y-3">
              {wreaths.map((wreath) => (
                <div
                  key={wreath.id}
                  className="p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100"
                >
                  <p className="text-gray-800">{wreath.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    - {wreath.sender}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 화환 모달 */}
      {showWreathModal && (
        <WreathModal
          onConfirm={handleCreateWreath}
          onClose={() => setShowWreathModal(false)}
        />
      )}
    </div>
  );
}
