import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as ReactRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IsometricCityPage } from "./pages/IsometricCityPage";
import { BuildingDetailPage } from "./pages/BuildingDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactRouter>
        <Routes>
          <Route element={<IsometricCityPage />} path="/" />
          <Route element={<BuildingDetailPage />} path="/details/:id" />
        </Routes>
      </ReactRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
