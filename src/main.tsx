import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { router } from "./router";
import { createQueryClient } from "./lib/queryClient";
import { TooltipProvider } from "./components/ui/Tooltip";
import "./styles.css";

const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              color: "var(--color-fg)",
            },
          }}
        />
        {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
