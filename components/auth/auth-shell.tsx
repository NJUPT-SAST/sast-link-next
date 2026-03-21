"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function AuthShell({
  title,
  description,
  children,
  className,
}: AuthShellProps) {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,oklch(from_var(--muted)_l_c_h_/_0.55)_0%,transparent_72%)]" />
      <div className="relative flex w-full max-w-[397px] flex-col gap-4 sm:gap-5">
        <div className="space-y-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Authentication
          </p>
          <h1 className="text-[36px] font-semibold tracking-tight text-foreground sm:text-[43px]">
            {title}
          </h1>
          <p className="max-w-[36ch] text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div
          className={cn(
            "flex min-h-[500px] max-h-[590px] w-full flex-col overflow-hidden rounded-[24px] border-[5px] border-border bg-card text-card-foreground shadow-[0_24px_80px_rgba(28,31,35,0.12)]",
            "max-[498px]:min-h-[510px] max-[498px]:max-h-[600px] max-[498px]:border-none max-[498px]:shadow-none",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
