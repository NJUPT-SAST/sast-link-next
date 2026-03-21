"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { userLogin, getUserInfo } from "@/lib/api/user";
import { handleError, type ErrorState } from "@/lib/form-helpers";
import { setToken } from "@/lib/token";
import { useUserListStore } from "@/store/use-user-list-store";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { DotLoading } from "@/components/ui/dot-loading";
import { PageTransition } from "@/components/animation/page-transition";
import { Footer } from "@/components/layout/footer";

interface LoginStep2Props {
  loginTicket: string;
  onBack: () => void;
}

export default function LoginStep2({ loginTicket, onBack }: LoginStep2Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const urlParams = useSearchParams();
  const addAccount = useUserListStore((s) => s.addAccount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ error: false });

  const redirectUri = urlParams.get("redirect")
    ? atob(urlParams.get("redirect")!)
    : "";

  const validate = useCallback((value: string) => {
    if (value === "") return "密码不可为空";
    return false;
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = inputRef.current?.value ?? "";
    const check = validate(password);
    if (check) {
      setError(handleError(check));
      return;
    }

    setLoading(true);
    userLogin(password, loginTicket, urlParams.get("oauthTicket"))
      .then((res) => {
        if (res.data.Success) {
          const token = res.data.Data.loginToken;
          setToken(token);

          return getUserInfo().then((infoRes) => {
            if (infoRes.data.Success) {
              const data = infoRes.data.Data;
              addAccount({
                nickName: "NJUPTer",
                email: data.email,
                token,
                userId: data.userId,
              });
              router.push(redirectUri || "/home");
              return;
            }
            setError(handleError(infoRes.data.ErrMsg));
          });
        }
        if (res.data.ErrCode === 20007) {
          onBack();
          return;
        }
        setError(handleError(res.data.ErrMsg));
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setError({ error: true, errMsg: "密码错误，请重新输入密码" });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <PageTransition className="flex w-full flex-col items-center gap-4 px-8 pt-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6"
      >
        <div className="w-full">
          <InputWithLabel
            ref={inputRef}
            label="密码"
            type="password"
            placeholder="密码"
            error={error}
            name="password"
          />
          <div className="mt-2 flex justify-end">
            <Link
              href="/reset"
              className="text-sm text-[#808080] hover:underline"
            >
              忘记密码
            </Link>
          </div>
        </div>

        <Footer>
          <button
            type="submit"
            disabled={loading}
            className="flex h-[42px] w-[314px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-xl font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <DotLoading />
            ) : redirectUri ? (
              "登录并前往授权"
            ) : (
              "登录 SAST Link"
            )}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex h-[42px] w-[314px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-white text-xl font-semibold text-[#1c1f23]"
          >
            使用其他账号
          </button>
        </Footer>
      </form>
    </PageTransition>
  );
}
