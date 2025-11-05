import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as ReactRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TestPage from "./pages/TestPage";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactRouter>
        <Routes>
          <Route element={<TestPage />} path="/"></Route>
        </Routes>
      </ReactRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
