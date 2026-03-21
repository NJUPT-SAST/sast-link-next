"use client";

import Image from "next/image";

import { message } from "@/lib/message";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BindAppItemProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  bound: boolean;
  darkModeIcon?: boolean;
}

export function BindAppItem({
  iconSrc,
  iconAlt,
  title,
  bound,
  darkModeIcon = false,
}: BindAppItemProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-3">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={24}
          height={24}
          className={cn(darkModeIcon && "dark:invert dark:brightness-0")}
        />
        <span className="text-sm">{title}</span>
      </div>
      {bound ? (
        <Badge variant="default">已绑定</Badge>
      ) : (
        <Badge
          variant="outline"
          className="cursor-pointer text-muted-foreground"
          onClick={() => message.warning("请退出并使用该方式登录绑定")}
        >
          未绑定
        </Badge>
      )}
    </div>
  );
}
