import { useState, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBuildingPersistence } from "@/three/hooks/useBuildingPersistence";
import { MODEL_CONFIG } from "@/three/config/models";
import { BuildingPreview } from "@/components/BuildingPreview";

export function CreateBuildingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const x = parseInt(searchParams.get("x") || "0");
  const z = parseInt(searchParams.get("z") || "0");

  const { createBuilding } = useBuildingPersistence();

  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedBuilding = MODEL_CONFIG.BUILDING_TYPES[selectedBuildingIndex];
      const color = Math.floor(Math.random() * 0xffffff);

      await createBuilding(
        {
          position_x: x,
          position_y: 0, // Default Y
          position_z: z,
          color: color,
          mesh_index: selectedBuilding.meshIndex,
          title: title || undefined,
          author: author || undefined,
          message1: message1 || undefined,
          message2: message2 || undefined,
        },
        password
      );

      navigate("/");
    } catch (err) {
      console.error("Error creating building:", err);
      setError(
        err instanceof Error
          ? err.message
          : "건물 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Left Side: Building Selection */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
          <h2 className="text-2xl font-bold mb-6 text-[#00ff88]">건물 선택</h2>
          <div className="grid grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 scrollbar-hide">
            {MODEL_CONFIG.BUILDING_TYPES.map((buildingType, index) => {
              const isSelected = selectedBuildingIndex === index;
              return (
                <div
                  key={buildingType.key}
                  onClick={() => setSelectedBuildingIndex(index)}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 border ${
                    isSelected
                      ? "border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                      : "border-white/10 bg-black/40 hover:border-white/30"
                  }`}
                >
                  <div className="aspect-square w-full relative bg-gradient-to-br from-white/5 to-transparent">
                     <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/20">Loading...</div>}>
                        <BuildingPreview meshIndex={buildingType.meshIndex} />
                     </Suspense>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className={`font-bold text-sm ${isSelected ? "text-[#00ff88]" : "text-white"}`}>
                      {buildingType.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">새로운 건물 짓기</h1>
            <p className="text-gray-400">
              위치: ({x}, {z})
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#00ff88] mb-1">
                  패스워드 (필수)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded focus:border-[#00ff88] focus:outline-none transition-colors text-white placeholder-gray-600"
                  placeholder="나중에 수정/삭제할 때 필요합니다"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00ff88] mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded focus:border-[#00ff88] focus:outline-none transition-colors text-white"
                  placeholder="건물의 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00ff88] mb-1">
                  작성자
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded focus:border-[#00ff88] focus:outline-none transition-colors text-white"
                  placeholder="당신의 닉네임"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00ff88] mb-1">
                  메시지 1
                </label>
                <textarea
                  value={message1}
                  onChange={(e) => setMessage1(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded focus:border-[#00ff88] focus:outline-none transition-colors text-white resize-none"
                  placeholder="남기고 싶은 말"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#00ff88] mb-1">
                  메시지 2
                </label>
                <textarea
                  value={message2}
                  onChange={(e) => setMessage2(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded focus:border-[#00ff88] focus:outline-none transition-colors text-white resize-none"
                  placeholder="추가 메시지"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors text-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 font-bold bg-[#00ff88] hover:bg-[#00cc6f] text-black rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "생성 중..." : "건물 생성"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
