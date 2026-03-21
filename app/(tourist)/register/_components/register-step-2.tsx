"use client";

import { useRef, useState, useCallback } from "react";

import { verifyCaptcha, verifyRegistAccount, sendMail } from "@/lib/api/auth";
import { handleError, type ErrorState } from "@/lib/form-helpers";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { DotLoading } from "@/components/ui/dot-loading";
import { VeriCode } from "@/components/auth/verification-code-input";
import { Footer } from "@/components/layout/footer";

interface Props {
  username: string;
  ticket: string;
  onTicket: (ticket: string) => void;
  onNext: () => void;
}

export default function RegisterStep2({
  username,
  ticket,
  onTicket,
  onNext,
}: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ErrorState>({ error: false });

  const validate = useCallback((value: string) => {
    if (value === "") return "验证码不可为空";
    return false;
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const captcha = inputRef.current?.value ?? "";
    const check = validate(captcha);
    if (check) {
      setError(handleError(check));
      return;
    }

    setLoading(true);
    verifyCaptcha(ticket, captcha)
      .then((res) => {
        if (res.data.Success) onNext();
        else setError(handleError(res.data.ErrMsg));
      })
      .catch(() => setError({ error: true, errMsg: "网络错误" }))
      .finally(() => setLoading(false));
  };

  const handleResend = async () => {
    const res = await verifyRegistAccount(username);
    if (res.data.Success) {
      const newTicket = res.data.Data.registerTicket;
      onTicket(newTicket);
      await sendMail(newTicket);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-6 px-8 pt-6"
    >
      <div className="w-full">
        <div className="flex items-center gap-1">
          <span className="text-xl font-semibold text-[#1c1f23]">S-</span>
          <div className="flex-1">
            <InputWithLabel
              ref={inputRef}
              error={error}
              name="veriCode"
              label="验证码"
              placeholder="验证码"
              maxLength={5}
            >
              <VeriCode onResend={handleResend} />
            </InputWithLabel>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          已经往 {username} 发送一封带有验证码的邮件，请注意查收！
        </p>
      </div>

      <Footer>
        <button
          type="submit"
          disabled={loading}
          className="flex h-[42px] w-[314px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-xl font-semibold text-white disabled:opacity-50"
        >
          {loading ? <DotLoading /> : "下一步"}
        </button>
      </Footer>
    </form>
  );
}
