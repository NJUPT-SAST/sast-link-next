"use client";

import { Toaster } from "@/components/ui/sonner";

export function GlobalMessagePanel() {
  return <Toaster data-testid="global-message-panel" position="top-center" />;
}
