"use client";

import { useState, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";

interface VeriCodeProps {
  onResend: () => Promise<void>;
}

export function VeriCode({ onResend }: VeriCodeProps) {
  const [clickable, setClickable] = useState(false);
  const [count, setCount] = useState(60);

  useEffect(() => {
    if (clickable) return;

    const intervalId = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) {
          setClickable(true);
          clearInterval(intervalId);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [clickable]);

  const handleResend = useCallback(async () => {
    setClickable(false);
    await onResend();
  }, [onResend]);

  return (
    <span
      onClick={clickable ? handleResend : undefined}
      className={cn(
        "text-base font-semibold",
        clickable
          ? "cursor-pointer text-primary"
          : "pointer-events-none text-muted-foreground",
      )}
    >
      {clickable ? "" : `${count}s 后`}重新发送
    </span>
  );
}
