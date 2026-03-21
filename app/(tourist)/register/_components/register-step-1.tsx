"use client";

import { useRef, useState, useCallback } from "react";

import { verifyRegistAccount, sendMail } from "@/lib/api/auth";
import { handleError, type ErrorState } from "@/lib/form-helpers";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { DotLoading } from "@/components/ui/dot-loading";
import { Footer } from "@/components/layout/footer";

interface Props {
  onNext: () => void;
  onTicket: (ticket: string) => void;
  onUsername: (username: string) => void;
}

export default function RegisterStep1({ onNext, onTicket, onUsername }: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ErrorState>({ error: false });

  const validate = useCallback((value: string) => {
    if (value === "") return "学号不可为空";
    return false;
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value ?? "";
    const check = validate(value);
    if (check) {
      setError(handleError(check));
      return;
    }

    setLoading(true);
    const mail = value + "@njupt.edu.cn";
    onUsername(mail);

    verifyRegistAccount(mail)
      .then((res) => {
        if (res.data.Success) {
          const ticket = res.data.Data.registerTicket;
          onTicket(ticket);
          return sendMail(ticket).then((mailRes) => {
            if (mailRes.data.Success) onNext();
            else setError(handleError(mailRes.data.ErrMsg));
          });
        }
        setError(handleError(res.data.ErrMsg));
      })
      .catch(() => setError({ error: true, errMsg: "网络错误" }))
      .finally(() => setLoading(false));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-6 px-8 pt-6"
    >
      <div className="w-full">
        <InputWithLabel
          ref={inputRef}
          label="学生邮箱"
          error={error}
          maxLength={9}
          name="mail"
          placeholder="学号"
        >
          <span>@njupt.edu.cn</span>
        </InputWithLabel>
        <p className="mt-2 text-sm text-muted-foreground">
          确认后，我们将会往你的邮箱发送一封验证邮件，请在验证后继续。
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
