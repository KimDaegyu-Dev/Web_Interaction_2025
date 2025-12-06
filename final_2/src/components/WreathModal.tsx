import { useState } from "react";

interface WreathModalProps {
  onConfirm: (message: string) => void;
  onClose: () => void;
}

/**
 * 화환 메시지 입력 모달
 */
export function WreathModal({ onConfirm, onClose }: WreathModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onConfirm(message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">🎉 축하 화환 보내기</h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 축하 메시지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              축하 메시지
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="축하하는 마음을 담아 메시지를 작성해주세요..."
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
          </div>

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
              className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:from-pink-600 hover:to-orange-600 transition-colors"
            >
              화환 보내기 🌸
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
