import { create } from "zustand";
import { supabase } from "@/utils/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signIn: (
    username: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUp: (
    username: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  getUsername: () => string | null;
  anonymousSignIn: () => Promise<{ error: Error | null }>;
  isAnonymous: () => boolean;
}

/**
 * 인증 상태 관리 스토어
 * Supabase Auth와 통합
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),

  initialize: async () => {
    try {
      set({ isLoading: true });
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        set({ user: null, session: null, isLoading: false, initialized: true });
        return;
      }

      set({
        user: session?.user ?? null,
        session: session,
        isLoading: false,
        initialized: true,
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ user: null, session: null, isLoading: false, initialized: true });
    }
  },

  signIn: async (username: string, password: string) => {
    try {
      set({ isLoading: true });
      // 사용자 이름을 이메일 형식으로 변환 (내부적으로만 사용)
      const email = `${username}@city.local`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  signUp: async (username: string, password: string) => {
    try {
      set({ isLoading: true });
      // 사용자 이름을 이메일 형식으로 변환 (내부적으로만 사용)
      const email = `${username}@city.local`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // user_metadata에 사용자 이름 저장
          },
        },
      });

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  getUsername: () => {
    const state = useAuthStore.getState();
    if (!state.user) return null;
    // user_metadata에서 사용자 이름 가져오기
    return (state.user.user_metadata?.username as string) || null;
  },

  anonymousSignIn: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        set({ isLoading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: error as Error };
    }
  },

  isAnonymous: () => {
    const state = useAuthStore.getState();
    if (!state.user) return false;
    // 익명 사용자는 is_anonymous가 true이거나 email이 null
    return state.user.is_anonymous === true;
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      set({ isLoading: false });
    }
  },
}));
