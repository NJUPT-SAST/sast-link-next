"use client";

import Link from "next/link";
import useSWR from "swr";
import { ChevronRight } from "lucide-react";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { getUserBindStatus } from "@/lib/api/user";
import { BindAppItem } from "@/components/profile/bind-app-item";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfilePanel() {
  const profile = useUserProfileStore((s) => s.profile);
  const { data: bindStatus } = useSWR("bindStatus", () =>
    getUserBindStatus().then((res) => (res.data.Success ? res.data.Data : [])),
  );

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle role="heading" aria-level={2}>
                个人资料
              </CardTitle>
              <CardDescription>首页展示你的身份摘要与常用入口。</CardDescription>
            </div>
            {profile.dep ? <Badge variant="outline">{profile.dep}</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-4 xl:flex-col xl:items-center">
            <Avatar className="size-18 border-2 border-foreground/20 md:size-20 xl:size-28 xl:border-[3px]">
              <AvatarImage
                src={profile.avatar ?? "/defaultAvatar.png"}
                alt="avatar"
              />
              <AvatarFallback className="text-xl md:text-2xl xl:text-3xl">
                {profile.nickname?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left xl:text-center">
              <div className="text-lg font-semibold xl:text-xl">
                {profile.nickname}
              </div>
              <div className="truncate text-sm text-muted-foreground">
                {profile.email}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {profile.dep || "暂无认证"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="w-full justify-between"
              asChild
            >
              <Link href="/home/edit">
                编辑信息
                <ChevronRight size={16} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between"
              asChild
            >
              <Link href="/home/edit/safety">
                安全设置
                <ChevronRight size={16} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hidden bg-card/80 backdrop-blur-sm md:flex">
        <CardHeader className="gap-1">
          <CardTitle role="heading" aria-level={3} className="text-base">
            账号绑定
          </CardTitle>
          <CardDescription>确认哪些常用登录方式已经完成绑定。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <BindAppItem
            iconSrc="/svg/qq.svg"
            iconAlt="QQ"
            title="QQ"
            bound={bindStatus?.includes("qq") ?? false}
            darkModeIcon
          />
          <BindAppItem
            iconSrc="/svg/feishu.svg"
            iconAlt="Feishu"
            title="SAST 飞书"
            bound={bindStatus?.includes("lark") ?? false}
            darkModeIcon
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
            darkModeIcon
          />
        </CardContent>
      </Card>
    </>
  );
}
