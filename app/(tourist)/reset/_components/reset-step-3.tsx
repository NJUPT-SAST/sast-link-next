"use client";

import { useRef, useState, useCallback } from "react";

import { resetPassword } from "@/lib/api/auth";
import { handleError, type ErrorState } from "@/lib/form-helpers";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { DotLoading } from "@/components/ui/dot-loading";
import { Footer } from "@/components/layout/footer";

interface Props {
  ticket: string;
  onNext: () => void;
}

export default function ResetStep3({ ticket, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [passError, setPassError] = useState<ErrorState>({ error: false });
  const [confirmError, setConfirmError] = useState<ErrorState>({
    error: false,
  });

  const validatePass = useCallback((value: string) => {
    if (value === "") return "密码不可为空";
    return false;
  }, []);

  const validateConfirm = useCallback((value: string) => {
    if (value !== passRef.current?.value) return "密码不一致";
    return false;
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = passRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";
    const passCheck = validatePass(password);
    const confirmCheck = validateConfirm(confirm);

    if (passCheck || confirmCheck) {
      setPassError(handleError(passCheck));
      setConfirmError(handleError(confirmCheck));
      return;
    }

    setLoading(true);
    resetPassword(password, ticket)
      .then((res) => {
        if (res.data.Success) {
          onNext();
          return;
        }
        setPassError(handleError(res.data.ErrMsg));
      })
      .catch(() => setPassError({ error: true, errMsg: "网络错误" }))
      .finally(() => setLoading(false));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-6 px-8 pt-6"
    >
      <div className="flex w-full flex-col gap-2">
        <InputWithLabel
          ref={passRef}
          type="password"
          placeholder="密码"
          label="密码"
          name="password"
          error={passError}
        />
        <InputWithLabel
          ref={confirmRef}
          type="password"
          placeholder="确认密码"
          label="确认密码"
          name="confirmPassword"
          error={confirmError}
        />
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
