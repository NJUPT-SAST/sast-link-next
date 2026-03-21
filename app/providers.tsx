"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import { GlobalMessagePanel } from "@/components/feedback/global-message-panel";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      {children}
      <GlobalMessagePanel />
    </SWRConfig>
  );
}
