"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePanelStore } from "@/store/use-panel-store";
import { message } from "@/lib/message";

const apps = [
  { name: "审批系统", icon: "/svg/app-logo/aprove.svg" },
  { name: "新柚杯", icon: "/svg/app-logo/fc.svg" },
  { name: "视觉科协", icon: "/svg/app-logo/seeing.svg" },
  { name: "Evento", icon: "/svg/app-logo/evento.svg" },
];

export default function AppPanel() {
  const { homeAppPanel, setHomeAppPanel } = usePanelStore();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setHomeAppPanel(false)}
        className={cn(
          "fixed inset-0 z-20 bg-black/30 transition-opacity duration-300",
          homeAppPanel ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed z-30 rounded-xl bg-white p-6 shadow-lg transition-all duration-300",
          "top-[150px] left-5 sm:left-[-80px] sm:top-[70px]",
          homeAppPanel
            ? "translate-x-0 opacity-100 sm:translate-x-[100px]"
            : "-translate-x-full opacity-0 sm:-translate-x-full",
        )}
      >
        <button
          onClick={() => setHomeAppPanel(false)}
          className="absolute right-4 top-4 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <div className="mb-4 text-lg font-semibold">应用</div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {apps.map((app) => (
            <div
              key={app.name}
              onClick={() => message.warning("暂未开放")}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg p-3 hover:bg-muted"
            >
              <Image width={32} height={32} src={app.icon} alt={app.name} />
              <span className="text-xs">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
