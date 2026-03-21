"use client";

import { cn } from "@/lib/utils";

interface BackLayoutProps {
  type?: "green" | "orange" | "yellow" | "blue";
}

const gradients = {
  yellow:
    "bg-[radial-gradient(47.47%_47.47%_at_49.91%_52.53%,#ffce20_0%,rgba(217,217,217,0)_100%)]",
  green:
    "bg-[radial-gradient(47.47%_47.47%_at_49.91%_52.53%,#20ffd7_0%,rgba(217,217,217,0)_100%)]",
  blue:
    "bg-[radial-gradient(47.47%_47.47%_at_49.91%_52.53%,#20afff_0%,rgba(217,217,217,0)_100%)]",
  orange:
    "bg-[radial-gradient(47.47%_47.47%_at_49.91%_52.53%,#ff8b20_0%,rgba(217,217,217,0)_100%)]",
};

export function BackLayout({ type = "yellow" }: BackLayoutProps) {
  return (
    <>
      {/* Desktop: show all 4 */}
      <div className="fixed inset-0 -z-10 hidden min-h-[725px] overflow-hidden opacity-40 sm:block">
        <div
          className={cn(
            "absolute left-[calc(50%-166px)] top-[calc(50%-200px)] h-[885px] w-[885px] -translate-x-1/2 -translate-y-1/2",
            gradients.blue,
          )}
        />
        <div
          className={cn(
            "relative left-[calc(50%+123px)] top-[calc(50%-59px)] h-[681px] w-[681px] -translate-x-1/2 -translate-y-1/2",
            gradients.yellow,
          )}
        />
        <div
          className={cn(
            "absolute left-[calc(50%-166px)] top-[calc(50%+167px)] h-[681px] w-[681px] -translate-x-1/2 -translate-y-1/2",
            gradients.orange,
          )}
        />
        <div
          className={cn(
            "absolute left-[calc(50%+136px)] top-[calc(50%+166px)] h-[823px] w-[823px] -translate-x-1/2 -translate-y-1/2",
            gradients.green,
          )}
        />
      </div>

      {/* Mobile: show only selected color */}
      <div className="fixed inset-0 -z-10 min-h-[660px] overflow-hidden opacity-40 sm:hidden">
        <div
          className={cn(
            "relative h-[681px] w-[681px] -translate-y-1/2",
            gradients[type],
          )}
        />
      </div>
    </>
  );
}
