"use client";

import Image from "next/image";
import { Menu } from "lucide-react";

import { usePanelStore } from "@/store/use-panel-store";
import { useUserProfileStore } from "@/store/use-user-profile-store";
import { Logo } from "@/components/icons/logo";

export function TopBar() {
  const { setHomeAppPanel, setHomeInfoPanel } = usePanelStore();
  const avatar = useUserProfileStore((s) => s.profile.avatar);

  return (
    <>
      <div className="fixed top-0 left-0 z-10 flex h-14 w-full items-center gap-5 bg-white/50 px-5 shadow-[0px_4px_30px_0px_rgba(68,68,68,0.05)] backdrop-blur-sm">
        <button
          onClick={() => setHomeAppPanel(true)}
          className="cursor-pointer select-none"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <Logo />
        <button
          onClick={() => setHomeInfoPanel(true)}
          className="absolute right-5 cursor-pointer select-none"
          aria-label="Open profile"
        >
          <Image
            src={avatar ?? "/defaultAvatar.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </button>
      </div>
      {/* Spacer */}
      <div className="h-14 w-px" />
    </>
  );
}
