import { useState, useEffect } from "react";
import type { PlacedObject } from "@/three/hooks/useGridInteraction";

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    password: string;
    title?: string;
    author?: string;
    message1?: string;
    message2?: string;
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
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {mode === "create"
              ? "건물 생성"
              : mode === "edit"
                ? "건물 수정"
                : "건물 삭제"}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              패스워드 {mode === "create" ? "(필수)" : ""}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === "create"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="패스워드를 입력하세요"
            />
          </div>

          {mode !== "delete" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="제목을 입력하세요"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  작성자
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="작성자를 입력하세요"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  메시지 1
                </label>
                <textarea
                  value={message1}
                  onChange={(e) => setMessage1(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="메시지를 입력하세요"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  메시지 2
                </label>
                <textarea
                  value={message2}
                  onChange={(e) => setMessage2(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="메시지를 입력하세요"
                />
              </div>
            </>
          )}

          {error && (
            <div className="rounded bg-red-50 p-2 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {mode === "create" ? "생성" : mode === "edit" ? "수정" : "삭제"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
