"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { ChevronRight } from "lucide-react";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { getUserBindStatus } from "@/lib/api/user";
import { BindAppItem } from "@/components/profile/bind-app-item";

export default function ProfilePanel() {
  const profile = useUserProfileStore((s) => s.profile);
  const { data: bindStatus } = useSWR("bindStatus", () =>
    getUserBindStatus().then((res) => (res.data.Success ? res.data.Data : [])),
  );

  return (
    <>
      {/* Profile Card */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-[140px] w-[140px] overflow-hidden rounded-full border-[3px] border-black">
            <Image
              src={profile.avatar ?? "/defaultAvatar.png"}
              alt="avatar"
              width={140}
              height={140}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">{profile.nickname}</div>
            <div className="text-sm text-muted-foreground">
              {profile.email}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {profile.dep || "暂无认证"}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/home/edit"
            className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted"
          >
            <span>编辑信息</span>
            <ChevronRight size={16} />
          </Link>
          <Link
            href="/home/edit/safety"
            className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted"
          >
            <span>安全设置</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bind Status */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <BindAppItem
          iconSrc="/svg/qq.svg"
          iconAlt="QQ"
          title="QQ"
          bound={bindStatus?.includes("qq") ?? false}
        />
        <BindAppItem
          iconSrc="/svg/feishu.svg"
          iconAlt="Feishu"
          title="SAST 飞书"
          bound={bindStatus?.includes("lark") ?? false}
        />
        <BindAppItem
          iconSrc="/svg/ms.svg"
          iconAlt="Microsoft"
          title="Microsoft"
          bound={bindStatus?.includes("microsoft") ?? false}
        />
        <BindAppItem
          iconSrc="/svg/github.svg"
          iconAlt="GitHub"
          title="GitHub"
          bound={bindStatus?.includes("github") ?? false}
        />
      </div>
    </>
  );
}
