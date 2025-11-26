import { useState, useEffect, useRef, Suspense } from "react";
import type { PlacedObject } from "@/three/hooks/useGridInteraction";
import { MODEL_CONFIG } from "@/three/config/models";
import { BuildingPreview } from "./BuildingPreview";

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    password: string;
    title?: string;
    author?: string;
    message1?: string;
    message2?: string;
    meshIndex: number;
  }) => void;
  mode: "create" | "edit" | "delete";
  building?: PlacedObject;
  error?: string | null;
}

export function BuildingModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  building,
  error,
}: BuildingModalProps) {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && building) {
        setTitle(building.title || "");
        setAuthor(building.author || "");
        setMessage1(building.message1 || "");
        setMessage2(building.message2 || "");
      } else {
        setTitle("");
        setAuthor("");
        setMessage1("");
        setMessage2("");
      }
      setPassword("");
      setSelectedBuildingIndex(0);
    }
  }, [isOpen, mode, building]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBuilding = MODEL_CONFIG.BUILDING_TYPES[selectedBuildingIndex];
    onSubmit({
      password,
      title: title || undefined,
      author: author || undefined,
      message1: message1 || undefined,
      message2: message2 || undefined,
      meshIndex: selectedBuilding.meshIndex,
    });
  };

  const handleCardClick = (index: number) => {
    setSelectedBuildingIndex(index);
    // Scroll to the selected card
    if (scrollContainerRef.current) {
      const cardHeight = 400;
      scrollContainerRef.current.scrollTo({
        top: index * cardHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(17, 17, 17, 0.85)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Left side - Building List (only in create mode) */}
        {mode === "create" && (
          <div className="w-1/2 relative overflow-hidden border-r border-[rgba(255,255,255,0.1)]">
            {/* Header */}
            <div
              className="absolute top-0 left-0 right-0 z-20 px-8 py-6"
              style={{
                background: "linear-gradient(180deg, #000000 0%, transparent 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-1" style={{ background: "#00ff88" }} />
                <h3 className="text-xl font-bold" style={{ color: "#00ff88" }}>
                  건물 선택
                </h3>
              </div>
            </div>

            {/* Building List Container */}
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto scrollbar-hide pt-24 pb-24 px-8"
            >
              <div className="space-y-4">
                {MODEL_CONFIG.BUILDING_TYPES.map((buildingType, index) => {
                  const isSelected = selectedBuildingIndex === index;

                  return (
                    <div
                      key={buildingType.key}
                      onClick={() => handleCardClick(index)}
                      onMouseEnter={() => setSelectedBuildingIndex(index)}
                      className="cursor-pointer rounded-lg overflow-hidden transition-transform duration-200"
                      style={{
                        height: "380px",
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(30, 30, 30, 0.8) 100%)",
                        border: isSelected
                          ? "2px solid #00ff88"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: isSelected
                          ? "0 0 30px rgba(0, 255, 136, 0.4), inset 0 0 20px rgba(0, 255, 136, 0.1)"
                          : "0 10px 30px rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                        transform: isSelected ? "scale(1)" : "scale(1)",
                      }}
                    >
                      <div className="w-full h-full p-4 flex flex-col">
                        {/* 3D Building Preview */}
                        <div
                          className="w-full flex-1 rounded overflow-hidden mb-3"
                          style={{
                            background: isSelected
                              ? "linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 100%)"
                              : "linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 255, 136, 0.02) 100%)",
                            border: `1px solid ${isSelected ? "rgba(0, 255, 136, 0.3)" : "rgba(0, 255, 136, 0.1)"}`,
                          }}
                        >
                          <Suspense
                            fallback={
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="animate-spin"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#00ff88"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                                  <path d="M12 2a10 10 0 0 1 10 10" />
                                </svg>
                              </div>
                            }
                          >
                            <BuildingPreview meshIndex={buildingType.meshIndex} />
                          </Suspense>
                        </div>

                        {/* Building Info */}
                        <div className="text-center">
                          <h4
                            className="text-lg font-bold mb-1"
                            style={{ color: isSelected ? "#00ff88" : "#fff" }}
                          >
                            {buildingType.name}
                          </h4>
                          <div
                            className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                            style={{
                              background: isSelected
                                ? "#00ff88"
                                : "rgba(255, 255, 255, 0.1)",
                              color: isSelected ? "#000" : "#666",
                            }}
                          >
                            Mesh #{buildingType.meshIndex}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scroll Indicator */}
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20"
              style={{ color: "#666" }}
            >
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="animate-bounce"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-xs mt-2">스크롤하여 선택</div>
            </div>
          </div>
        )}

        {/* Right side - Form */}
        <div className={`${mode === "create" ? "w-1/2" : "w-full"} flex flex-col`}>
          {/* Header */}
          <div
            className="px-8 py-6 border-b"
            style={{
              background: "linear-gradient(90deg, #000000 0%, #1a1a1a 100%)",
              borderColor: "#00ff88",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-1" style={{ background: "#00ff88" }} />
                <h2 className="text-2xl font-bold" style={{ color: "#ffffff" }}>
                  {mode === "create"
                    ? "건물 생성"
                    : mode === "edit"
                      ? "건물 수정"
                      : "건물 삭제"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center text-2xl font-light hover:scale-110 transition-transform"
                style={{
                  color: "#888",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Building Description - Only show in create mode */}
            {mode === "create" && (
              <div
                className="p-4 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%)",
                  border: "1px solid rgba(0, 255, 136, 0.2)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{
                      background: "#00ff88",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#00ff88" }}>
                      {MODEL_CONFIG.BUILDING_TYPES[selectedBuildingIndex].name}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#ccc" }}>
                      {MODEL_CONFIG.BUILDING_TYPES[selectedBuildingIndex].description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: "#00ff88" }}>
                패스워드 {mode === "create" ? "(필수)" : ""}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode === "create"}
                className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00ff88";
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 255, 136, 0.2)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                placeholder="패스워드를 입력하세요"
              />
            </div>

            {mode !== "delete" && (
              <>
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: "#00ff88" }}>
                    제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00ff88";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 255, 136, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="제목을 입력하세요"
                  />
                </div>

                {/* Author Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: "#00ff88" }}>
                    작성자
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00ff88";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 255, 136, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="작성자를 입력하세요"
                  />
                </div>

                {/* Message 1 Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: "#00ff88" }}>
                    메시지 1
                  </label>
                  <textarea
                    value={message1}
                    onChange={(e) => setMessage1(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none resize-none"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00ff88";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 255, 136, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="메시지를 입력하세요"
                  />
                </div>

                {/* Message 2 Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: "#00ff88" }}>
                    메시지 2
                  </label>
                  <textarea
                    value={message2}
                    onChange={(e) => setMessage2(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none resize-none"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00ff88";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 255, 136, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="메시지를 입력하세요"
                  />
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div
                className="p-4"
                style={{
                  background: "rgba(255, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 0, 0, 0.3)",
                  color: "#ff6b6b",
                }}
              >
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 font-medium hover:bg-white/5 transition-colors"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#888",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 font-medium hover:opacity-90 transition-opacity"
                style={{
                  background: "linear-gradient(135deg, #00ff88 0%, #00cc6f 100%)",
                  color: "#000",
                  border: "none",
                }}
              >
                {mode === "create" ? "생성" : mode === "edit" ? "수정" : "삭제"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
