"use client";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { message } from "@/lib/message";
import { BackButton } from "@/components/navigation/back-button";
import { InputWithLabel } from "@/components/ui/input-with-label";

export default function SafetyPage() {
  const email = useUserProfileStore((s) => s.profile.email);

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <BackButton />
      <h3 className="text-lg font-semibold">邮箱设置</h3>
      <InputWithLabel
        label="邮箱"
        name="email"
        error={{ error: false }}
        defaultValue={email}
        disabled
        className="rounded-lg border-4 border-gray-300 bg-gray-100 px-3.5 py-2"
      />
      <button
        onClick={() => message.warning("功能未开放")}
        className="flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-lg font-semibold text-white"
      >
        重新绑定
      </button>
    </div>
  );
}
