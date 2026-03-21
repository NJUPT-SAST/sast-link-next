"use client";

import Image from "next/image";

import { message } from "@/lib/message";

interface BindAppItemProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  bound: boolean;
}

export function BindAppItem({ iconSrc, iconAlt, title, bound }: BindAppItemProps) {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row items-center gap-4">
        <Image src={iconSrc} alt={iconAlt} width={24} height={24} />
        <span>{title}</span>
      </div>
      {bound ? (
        <div className="text-[#4caf50]">已绑定</div>
      ) : (
        <button
          onClick={() => message.warning("请退出并使用该方式登录绑定")}
          className="flex cursor-pointer items-center gap-3.5 text-[#808080]"
        >
          <span>未绑定</span>
        </button>
      )}
    </div>
  );
}
