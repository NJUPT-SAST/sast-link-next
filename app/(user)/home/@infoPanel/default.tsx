"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePanelStore } from "@/store/use-panel-store";
import { useUserProfileStore } from "@/store/use-user-profile-store";
import { useAuthStore } from "@/store/use-auth-store";
import { message } from "@/lib/message";
import { clearToken } from "@/lib/token";

export default function InfoPanel() {
  const { homeInfoPanel, setHomeInfoPanel } = usePanelStore();
  const profile = useUserProfileStore((s) => s.profile);
  const resetProfile = useUserProfileStore((s) => s.resetProfile);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    resetProfile();
    clearToken();
    localStorage.removeItem("user-list-store");
    localStorage.removeItem("auth-store");
    message.success("退出成功");
    setHomeInfoPanel(false);
    router.replace("/login");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setHomeInfoPanel(false)}
        className={cn(
          "fixed inset-0 z-20 bg-black/30 transition-opacity duration-300",
          homeInfoPanel ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Mobile slide-up / Desktop dropdown panel */}
      <div
        className={cn(
          "fixed z-30 rounded-xl bg-white p-6 shadow-lg transition-all duration-300",
          "inset-x-0 bottom-0 sm:bottom-auto sm:right-5 sm:top-[50px] sm:left-auto sm:w-[360px]",
          homeInfoPanel
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-[-20px]",
        )}
      >
        <button
          onClick={() => setHomeInfoPanel(false)}
          className="absolute right-4 top-4 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center gap-3 sm:hidden">
          <Image
            src={profile.avatar ?? "/defaultAvatar.png"}
            alt="avatar"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div className="text-lg font-semibold">{profile.nickname}</div>
          <div className="text-sm text-muted-foreground">{profile.email}</div>
        </div>

        {/* Basic info (mobile only) */}
        <div className="mt-4 flex flex-col gap-3 sm:hidden">
          <div className="text-sm font-semibold text-muted-foreground">
            基本信息
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">昵称</span>
            <span>{profile.nickname}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">邮箱</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">个人简介</span>
            <span>{profile.bio ?? "-"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">社交链接</span>
            {profile.link?.map((link, i) => (
              <a
                key={`${link}-${i}`}
                href={link}
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                {link}
              </a>
            )) ?? <span>-</span>}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex h-[42px] w-full cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-white text-lg font-semibold text-[#1c1f23]"
        >
          退出登录
        </button>
      </div>

      {/* Desktop left info panel (always visible on desktop) */}
      <div className="hidden flex-col gap-4 rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm md:flex">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            个人简介
          </div>
          <div className="mt-1 text-sm">
            {profile.bio ?? "还没有内容哦"}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            社交链接
          </div>
          <div className="mt-1 flex flex-col gap-1">
            {profile.link && profile.link.length > 0
              ? profile.link.map((link, i) => (
                  <a
                    key={`desktop-${link}-${i}`}
                    href={link}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {link}
                  </a>
                ))
              : <span className="text-sm">还没有链接哦</span>}
          </div>
        </div>
      </div>
    </>
  );
}
