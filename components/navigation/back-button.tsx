"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-fit text-muted-foreground"
      onClick={() => router.back()}
    >
      <ArrowLeft size={16} />
      返回
    </Button>
  );
}
