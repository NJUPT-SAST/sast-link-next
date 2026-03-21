"use client";

import Image from "next/image";
import Link from "next/link";

import { MagicCard } from "@/components/ui/magic-card";

const apps = [
  { name: "审批系统", icon: "/svg/app-logo/aprove.svg", href: "https://approve.sast.fun" },
  { name: "SASTOJ", icon: "/svg/app-logo/fc.svg", href: "https://fc.sast.fun" },
  { name: "视觉科协", icon: "/svg/sastimage.svg", href: "https://sastimg.mxte.cc" },
  { name: "SAST Evento", icon: "/svg/app-logo/evento.svg", href: "https://evento.sast.fun" },
];

export default function HomePage() {
  return (
    <div className="rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <h2 className="mb-4 text-2xl font-semibold">应用</h2>
      <div className="grid grid-cols-2 gap-3">
        {apps.map((app) => (
          <Link key={app.name} href={app.href} target="_blank">
            <MagicCard className="cursor-pointer select-none p-4">
              <div className="flex flex-col items-center gap-2">
                <Image width={32} height={32} src={app.icon} alt={app.name} />
                <span className="text-sm font-medium">{app.name}</span>
              </div>
            </MagicCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
