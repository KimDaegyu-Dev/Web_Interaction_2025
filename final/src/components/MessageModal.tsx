import { useState, useEffect } from "react";
import type { PlacedObject } from "@/three/hooks/useGridInteraction";

interface MessageModalProps {
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

export function MessageModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  building,
  error,
}: MessageModalProps) {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");

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
    }
  }, [isOpen, mode, building]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      password,
      title: title || undefined,
      author: author || undefined,
      message1: message1 || undefined,
      message2: message2 || undefined,
      meshIndex: 0, // Default for now
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(17, 17, 17, 0.85)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-lg overflow-hidden shadow-2xl flex flex-col rounded-xl"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
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
              <div className="h-8 w-1" style={{ background: "#00ff88" }} />
              <h2 className="text-xl font-bold" style={{ color: "#ffffff" }}>
                {mode === "create"
                  ? "메시지 남기기"
                  : mode === "edit"
                    ? "메시지 수정"
                    : "메시지 삭제"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-xl font-light hover:scale-110 transition-transform rounded-full"
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
              className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none rounded-lg"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                background: "rgba(0, 0, 0, 0.2)",
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
                  className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none rounded-lg"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    background: "rgba(0, 0, 0, 0.2)",
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
                  className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none rounded-lg"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    background: "rgba(0, 0, 0, 0.2)",
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
                  className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none resize-none rounded-lg"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    background: "rgba(0, 0, 0, 0.2)",
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
                  className="w-full px-4 py-3 bg-transparent transition-all duration-200 focus:outline-none resize-none rounded-lg"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    background: "rgba(0, 0, 0, 0.2)",
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
              className="p-4 rounded-lg"
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
              className="flex-1 px-6 py-3 font-medium hover:bg-white/5 transition-colors rounded-lg"
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
              className="flex-1 px-6 py-3 font-medium hover:opacity-90 transition-opacity rounded-lg"
              style={{
                background: "linear-gradient(135deg, #00ff88 0%, #00cc6f 100%)",
                color: "#000",
                border: "none",
              }}
            >
              {mode === "create" ? "등록" : mode === "edit" ? "수정" : "삭제"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
