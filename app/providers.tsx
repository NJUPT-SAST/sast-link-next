"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";

import { GlobalMessagePanel } from "@/components/feedback/global-message-panel";

export function Providers({ children }: { children: ReactNode }) {
  const [mockReady, setMockReady] = useState(
    process.env.NEXT_PUBLIC_API_MOCKING !== "true",
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "true") return;
    import("@/mocks").then(({ initMocks }) =>
      initMocks().then(() => setMockReady(true)),
    );
  }, []);

  if (!mockReady) return null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SWRConfig value={{ revalidateOnFocus: false }}>
        {children}
        <GlobalMessagePanel />
      </SWRConfig>
    </ThemeProvider>
  );
}
