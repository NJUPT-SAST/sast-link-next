"use client";

import { memo } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { UserAccount } from "@/lib/api/types";

interface AccountItemProps {
  account: UserAccount;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const AccountItem = memo(function AccountItem({
  account,
  selected,
  onSelect,
  onRemove,
}: AccountItemProps) {
  return (
    <div
      onClick={onSelect}
      tabIndex={0}
      className={cn(
        "flex h-[78px] w-full shrink-0 cursor-pointer select-none flex-row items-center justify-between rounded-[10px] px-3.5",
        selected && "bg-[#f0f0f0]",
      )}
    >
      <div className="inline-block h-11 w-11 rounded-full border-[3px] border-black">
        <Image
          src={account.avatar ?? "/defaultAvatar.png"}
          alt="avatar"
          height={44}
          width={44}
          className="rounded-full"
        />
      </div>
      <div className="w-[200px] flex-col font-semibold">
        <div className="w-full text-xl leading-7">
          {account.nickName ?? "NJUPTer"}
        </div>
        <div className="w-full text-sm leading-[18px]">{account.email}</div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-[#e2d4d4]"
        aria-label="Remove account"
      >
        <X size={11} />
      </button>
    </div>
  );
});

interface AccountPanelProps {
  accounts: UserAccount[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
}

export function AccountPanel({
  accounts,
  selectedIndex,
  onSelect,
  onRemove,
}: AccountPanelProps) {
  return (
    <div className="flex h-[calc(27px+36vh)] min-h-[267px] max-h-[337px] w-[330px] flex-col items-center py-7 pb-[58px]">
      <div
        className="relative flex w-[330px] flex-col items-center overflow-y-scroll scrollbar-none"
        style={{
          height: "calc(30vh)",
          minHeight: "240px",
          maskImage:
            "linear-gradient(transparent 0%, white 80px, white calc(max(30vh, 240px) / 2 + 40px), transparent 100%)",
        }}
      >
        <div className="h-20 w-full shrink-0" />
        {accounts.map((account, index) => (
          <AccountItem
            key={`${account.email}_${account.nickName}`}
            account={account}
            selected={index === selectedIndex}
            onSelect={() => onSelect(index)}
            onRemove={() => onRemove(index)}
          />
        ))}
        <div
          className="w-full shrink-0"
          style={{ height: "calc(max(30vh, 240px) - 60px - 80px)" }}
        />
      </div>
    </div>
  );
}
