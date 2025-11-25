import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./components/App/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Зменшуємо час, протягом якого дані вважаються свіжими, для кращого демо
      staleTime: 1000 * 5,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Обгортаємо App в QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
