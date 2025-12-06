import { useEffect } from "react";
import { Router } from "./Router";
import { supabase } from "./utils/supabase";
import { useAuthStore } from "./stores/authStore";

function App() {
  const { initialize, setUser, setSession } = useAuthStore();

  // 초기 세션 로드
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Auth 상태 변경 리스너
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession]);

  return <Router />;
}

export default App;
