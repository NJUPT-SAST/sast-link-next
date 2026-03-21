"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, UserPen } from "lucide-react";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const apps = [
  {
    name: "审批系统",
    icon: "/svg/app-logo/aprove.svg",
    href: "https://approve.sast.fun",
    darkModeIcon: false,
  },
  {
    name: "SASTOJ",
    icon: "/svg/app-logo/fc.svg",
    href: "https://fc.sast.fun",
    darkModeIcon: true,
  },
  {
    name: "视觉科协",
    icon: "/svg/sastimage.svg",
    href: "https://sastimg.mxte.cc",
    darkModeIcon: true,
  },
  {
    name: "SAST Evento",
    icon: "/svg/app-logo/evento.svg",
    href: "https://evento.sast.fun",
    darkModeIcon: true,
  },
];

export default function HomePage() {
  const profile = useUserProfileStore((s) => s.profile);
  const [bioExpanded, setBioExpanded] = useState(false);
  const visibleLinks = profile.link?.filter(Boolean) ?? [];
  const bio = profile.bio?.trim() ?? "";
  const hasLongBio = bio.length > 120;
  const displayedBio =
    hasLongBio && !bioExpanded ? `${bio.slice(0, 120).trimEnd()}...` : bio;
  const profileCompletion = [
    profile.nickname,
    profile.email,
    profile.dep,
    profile.bio,
    visibleLinks[0],
  ].filter(Boolean).length;

  const highlights = [
    {
      label: "资料完成度",
      value: `${Math.round((profileCompletion / 5) * 100)}%`,
      detail: "昵称、邮箱、部门、简介与社交链接",
    },
    {
      label: "已配置链接",
      value: `${visibleLinks.length}`,
      detail: visibleLinks.length > 0 ? "个人主页已展示" : "还没有公开链接",
    },
    {
      label: "常用应用",
      value: `${apps.length}`,
      detail: "审批、OJ、视觉科协与 Evento",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="gap-3 md:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              首页概览
            </Badge>
            <CardTitle role="heading" aria-level={1} className="text-xl md:text-2xl">
              今日概览
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm md:text-base">
              欢迎回来，{profile.nickname}。这里会优先呈现你的资料摘要、常用操作和应用入口，让首页不再只是一块孤立的应用面板。
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            {profile.dep ? <Badge variant="outline">{profile.dep}</Badge> : null}
            <Badge variant="outline">{profile.email}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border bg-background/80 p-4"
              >
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold">{item.value}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>
              优先处理最常见的资料维护和安全设置操作。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Button asChild>
              <Link href="/home/edit">
                <UserPen data-icon="inline-start" />
                编辑信息
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/home/edit/safety">
                <ShieldCheck data-icon="inline-start" />
                安全设置
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>更多资料</CardTitle>
            <CardDescription>
              补充展示你的个人简介与公开链接，并在长简介时保持默认布局稳定。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                个人简介
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {displayedBio || "还没有内容哦"}
              </p>
              {hasLongBio ? (
                <Button
                  variant="ghost"
                  className="h-auto justify-start px-0 text-sm"
                  onClick={() => setBioExpanded((value) => !value)}
                >
                  {bioExpanded ? "收起简介" : "展开更多"}
                </Button>
              ) : null}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                社交链接
              </div>
              <div className="flex flex-col gap-2">
                {visibleLinks.length > 0 ? (
                  visibleLinks.map((link, index) => (
                    <a
                      key={`${link}-${index}`}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-blue-600 hover:underline"
                    >
                      {link}
                    </a>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    还没有链接哦
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle role="heading" aria-level={2}>
            常用应用
          </CardTitle>
          <CardDescription>
            保留现有应用入口，并把它们收纳进更稳定的首页主内容区。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {apps.map((app) => (
              <Link key={app.name} href={app.href} target="_blank">
                <MagicCard className="cursor-pointer select-none p-3.5 md:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-3">
                      <Image
                        width={32}
                        height={32}
                        src={app.icon}
                        alt={app.name}
                        className={
                          app.darkModeIcon
                            ? "dark:invert dark:brightness-0"
                            : undefined
                        }
                      />
                      <div className="space-y-1">
                        <span className="block text-sm font-medium">
                          {app.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          一键打开对应服务
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight
                      data-icon="inline-end"
                      className="text-muted-foreground"
                    />
                  </div>
                </MagicCard>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
