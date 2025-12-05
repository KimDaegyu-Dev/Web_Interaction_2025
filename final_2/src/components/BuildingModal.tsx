import { useState } from "react";
import { cn, isValidBuildingText } from "@/utils";
import { getAllBuildingPresets } from "@/three/config/buildingPresets";

interface BuildingModalProps {
  mode: "create" | "edit" | "delete";
  building?: {
    id: string;
    title?: string | null;
    author?: string | null;
    buildingText?: string | null;
    meshIndex: number;
  } | null;
  onConfirm: (data: {
    title: string;
    author: string;
    buildingText: string;
    meshIndex: number;
    password: string;
  }) => void;
  onDelete?: (password: string) => void;
  onClose: () => void;
  error?: string | null;
}

/**
 * 건물 생성/수정/삭제 모달
 */
export function BuildingModal({
  mode,
  building,
  onConfirm,
  onDelete,
  onClose,
  error,
}: BuildingModalProps) {
  const presets = getAllBuildingPresets();
  
  const [title, setTitle] = useState(building?.title || "");
  const [author, setAuthor] = useState(building?.author || "");
  const [buildingText, setBuildingText] = useState(building?.buildingText || "");
  const [meshIndex, setMeshIndex] = useState(building?.meshIndex || 0);
  const [password, setPassword] = useState("");
  const [textError, setTextError] = useState<string | null>(null);

  const handleBuildingTextChange = (value: string) => {
    if (value.length > 10) {
      setTextError("외벽 텍스트는 최대 10자까지 입력 가능합니다.");
      return;
    }
    setTextError(null);
    setBuildingText(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "delete") {
      onDelete?.(password);
      return;
    }

    if (!isValidBuildingText(buildingText)) {
      setTextError("외벽 텍스트는 최대 10자까지 입력 가능합니다.");
      return;
    }

    onConfirm({
      title,
      author,
      buildingText,
      meshIndex,
      password,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {mode === "create" && "새 건물 추가"}
            {mode === "edit" && "건물 수정"}
            {mode === "delete" && "건물 삭제"}
          </h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode !== "delete" && (
            <>
              {/* 건물 타입 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건물 타입
                </label>
                <select
                  value={meshIndex}
                  onChange={(e) => setMeshIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {presets.map((preset) => (
                    <option key={preset.meshIndex} value={preset.meshIndex}>
                      {preset.name} - {preset.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건물 이름
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 우리집"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 작성자 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작성자
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 외벽 텍스트 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  외벽 텍스트 <span className="text-gray-400">(최대 10자)</span>
                </label>
                <input
                  type="text"
                  value={buildingText}
                  onChange={(e) => handleBuildingTextChange(e.target.value)}
                  placeholder="예: 행복하자"
                  maxLength={10}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent",
                    textError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  )}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-red-500">{textError}</span>
                  <span className="text-xs text-gray-400">
                    {buildingText.length}/10
                  </span>
                </div>
              </div>
            </>
          )}

          {mode === "delete" && (
            <p className="text-gray-600">
              이 건물을 삭제하시겠습니까? 삭제하려면 비밀번호를 입력하세요.
            </p>
          )}

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 {mode === "create" && "(수정/삭제 시 필요)"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className={cn(
                "flex-1 px-4 py-2 text-white rounded-lg transition-colors",
                mode === "delete"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              {mode === "create" && "추가"}
              {mode === "edit" && "수정"}
              {mode === "delete" && "삭제"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
