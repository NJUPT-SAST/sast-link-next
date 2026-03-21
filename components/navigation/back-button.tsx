"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex w-full cursor-pointer items-center gap-5 p-0 text-[#808080]"
    >
      <ArrowLeft size={20} />
      Back
    </button>
  );
}
