"use client";

import type { ReactNode } from "react";

import { message } from "@/lib/message";

interface OtherLoginItem {
  target: string;
  describe: string;
  icon: ReactNode;
}

export function OtherLoginList({ list }: { list: OtherLoginItem[] }) {
  return (
    <ul className="inline-flex w-[312px] flex-row items-center justify-center gap-[30px] p-0 m-0 list-none">
      {list.map((item) => (
        <li key={`other_login_${item.describe}`} className="inline-flex">
          <a
            title={item.describe}
            href={item.target || undefined}
            onClick={() => {
              if (!item.target) message.warning("暂未开放");
            }}
            className="inline-flex h-11 w-11 cursor-pointer select-none items-center justify-center rounded-full border-[3px] border-[#1c1f23]"
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
