import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HashRouter as ReactRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IntroPage } from "./pages/IntroPage";
import { IsometricCityPage } from "./pages/IsometricCityPage";
import { BuildingDetailPage } from "./pages/BuildingDetailPage";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Protected Route 컴포넌트
 * 인증되지 않은 사용자는 인트로 페이지로 리다이렉트
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initialized } = useAuthStore();

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

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactRouter>
        <Routes>
          <Route element={<IntroPage />} path="/" />
          <Route
            element={
              <ProtectedRoute>
                <IsometricCityPage />
              </ProtectedRoute>
            }
            path="/city"
          />
          <Route
            element={
              <ProtectedRoute>
                <BuildingDetailPage />
              </ProtectedRoute>
            }
            path="/details/:id"
          />
        </Routes>
      </ReactRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
