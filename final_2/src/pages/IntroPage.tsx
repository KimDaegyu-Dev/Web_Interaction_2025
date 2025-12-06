import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/utils/supabase";

const CITY_NAME = "아이소메트릭 도시";

/**
 * 확인 모달 컴포넌트
 */
function ConfirmModal({
  isSignUp,
  username,
  onConfirm,
  onCancel,
}: {
  isSignUp: boolean;
  username: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const currentHour = new Date().getHours();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {isSignUp ? "입주 확인" : "환영합니다"}
          </h2>
        </div>

        <div className="p-6">
          <p className="text-lg text-gray-800 mb-6">
            {isSignUp ? (
              <>
                <span className="font-bold text-blue-600">{CITY_NAME}</span>에
                새로 입주하시겠습니까?
              </>
            ) : (
              <>
                건물주{" "}
                <span className="font-bold text-purple-600">{username}</span>님
                돌아 오신것을 환영합니다! -{currentHour}시
              </>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 인트로 페이지
 * 통합 로그인/회원가입
 */
export function IntroPage() {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    initialized,
    signIn,
    signUp,
    getUsername,
    anonymousSignIn,
  } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [pendingUsername, setPendingUsername] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);

  // 이미 로그인된 경우 도시로 리다이렉트
  useEffect(() => {
    if (initialized && user) {
      navigate("/city", { replace: true });
    }
  }, [user, initialized, navigate]);

  // 통합 로그인/회원가입 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("사용자 이름과 비밀번호를 입력해주세요.");
      return;
    }

    // 사용자 이름 검증 (영문, 숫자, 언더스코어, 하이픈만 허용)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      setError(
        "사용자 이름은 영문, 숫자, 언더스코어(_), 하이픈(-)만 사용할 수 있습니다."
      );
      return;
    }

    // 사용자 이름 길이 검증
    if (username.length < 3 || username.length > 20) {
      setError("사용자 이름은 3자 이상 20자 이하여야 합니다.");
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // 먼저 로그인 시도
    const { error: signInError } = await signIn(username, password);

    if (signInError) {
      // 로그인 실패 시, 회원가입 시도
      const { error: signUpError } = await signUp(username, password);

      if (signUpError) {
        // 회원가입도 실패한 경우 (이미 존재하는 사용자 이름이거나 다른 에러)
        if (
          signUpError.message.includes("already registered") ||
          signUpError.message.includes("User already registered") ||
          signUpError.message.includes("already exists")
        ) {
          setError("이미 등록된 사용자 이름입니다. 비밀번호를 확인해주세요.");
        } else {
          setError(signUpError.message || "로그인 및 회원가입에 실패했습니다.");
        }
      } else {
        // 회원가입 성공
        setPendingUsername(username);
        setIsSignUp(true);
        setShowConfirmModal(true);
      }
    } else {
      // 로그인 성공
      setPendingUsername(username);
      setIsSignUp(false);
      setShowConfirmModal(true);
    }
  };

  // 확인 모달에서 확인 클릭
  const handleConfirm = async () => {
    if (isSignUp) {
      // 회원가입은 이미 완료되었으므로 바로 이동
      // (handleSubmit에서 이미 회원가입 처리됨)
    }
    // 로그인 성공 또는 회원가입 성공 후 도시로 이동
    navigate("/city", { replace: true });
  };

  // 확인 모달 취소
  const handleCancel = () => {
    setShowConfirmModal(false);
    setPendingUsername("");
    setPendingPassword("");
  };

  // 방문자로 입장 (익명 로그인)
  const handleAnonymousSignIn = async () => {
    setError(null);
    setIsAnonymousLoading(true);

    const { error: signInError } = await anonymousSignIn();

    if (signInError) {
      setError("방문자 입장에 실패했습니다: " + signInError.message);
      setIsAnonymousLoading(false);
      return;
    }

    // 익명 로그인 성공 시 바로 도시로 이동
    navigate("/city", { replace: true });
  };

  if (isLoading || !initialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-white text-center">
            🏙️ {CITY_NAME}
          </h1>
          <p className="text-blue-100 text-center mt-2">
            도시에 입주하여 건물을 짓고 관리하세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* 사용자 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사용자 이름
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="예: 홍길동"
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_-]+"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              영문, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능 (3-20자)
            </p>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              최소 6자 이상 입력해주세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <p className="font-semibold mb-1">💡 빠른 이용 안내</p>
            <p>
              기존 사용자 이름이면 로그인되고, 없으면 자동으로 회원가입됩니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            시작하기
          </button>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 방문자로 입장 버튼 */}
        <div className="px-8 pb-8">
          <button
            onClick={handleAnonymousSignIn}
            disabled={isAnonymousLoading}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnonymousLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                입장 중...
              </span>
            ) : (
              "👁️ 방문자로 입장"
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            방문자는 도시를 둘러볼 수 있지만, 건물을 만들거나 화환을 보낼 수
            없습니다.
          </p>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <ConfirmModal
          isSignUp={isSignUp}
          username={pendingUsername}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
