"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { verifyLoginAccount } from "@/lib/api/auth";
import { handleError, type ErrorState } from "@/lib/form-helpers";
import { message } from "@/lib/message";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { DotLoading } from "@/components/ui/dot-loading";
import { OtherLoginList } from "@/components/auth/other-login-list";
import { GithubIcon, QqIcon, MsIcon } from "@/components/icons/brand-icons";
import { PageTransition } from "@/components/animation/page-transition";
import { Footer } from "@/components/layout/footer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface LoginStep1Props {
  onNext: (ticket: string) => void;
}

export default function LoginStep1({ onNext }: LoginStep1Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlParams = useSearchParams();
  const [error, setError] = useState<ErrorState>({ error: false });

  // BUG FIX: moved inside component (was at module scope accessing window)
  const oauthList = useMemo(
    () => [
      {
        target:
          typeof window !== "undefined"
            ? `${API_BASE}/login/github?redirect_url=${window.location.protocol}//${window.location.host}/callback/github`
            : "",
        describe: "Github",
        icon: <GithubIcon />,
      },
      { target: "", describe: "QQ", icon: <QqIcon /> },
      { target: "", describe: "Microsoft", icon: <MsIcon /> },
    ],
    [],
  );

  const validate = useCallback((value: string) => {
    if (value === "") return "用户名不可为空";
    return false;
  }, []);

  useEffect(() => {
    if (urlParams.get("oauthTicket")) {
      message.warning("请先绑定账号");
    }
  }, [urlParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = inputRef.current?.value ?? "";
    const check = validate(username);
    if (check) {
      setError(handleError(check));
      return;
    }

    setLoading(true);
    verifyLoginAccount(username)
      .then((res) => {
        if (res.data.Success) {
          onNext(res.data.Data.loginTicket);
          return;
        }
        setError({ error: true, errMsg: res.data.ErrMsg });
      })
      .catch(() => {
        setError({ error: true, errMsg: "网络错误" });
      })
      .finally(() => setLoading(false));
  };

  const isOAuthBinding = !!urlParams.get("oauthTicket");

  return (
    <PageTransition className="flex w-full flex-col items-center gap-4 px-8 pt-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6"
      >
        <div className="w-full">
          <InputWithLabel
            ref={inputRef}
            label="账户"
            name="username"
            error={error}
            placeholder="学号或邮箱"
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

        <button
          type="submit"
          disabled={loading}
          className="flex h-[42px] w-[314px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-xl font-semibold text-white disabled:opacity-50"
        >
          {loading ? (
            <DotLoading />
          ) : isOAuthBinding ? (
            "绑定账号"
          ) : (
            "下一步"
          )}
        </button>
      </form>

      {!isOAuthBinding && (
        <>
          <a
            href={
              typeof window !== "undefined"
                ? `${API_BASE}/login/lark?redirect_url=${window.location.protocol}//${window.location.host}/callback/feishu`
                : "#"
            }
            className="text-sm text-[#1c1f23] hover:underline"
          >
            SAST 飞书登录
          </a>
          <OtherLoginList list={oauthList} />
        </>
      )}

      <div className="text-sm">
        没有账号？
        <Link href="/register" className="text-[#0a96d6] hover:underline">
          注册
        </Link>
      </div>
    </PageTransition>
  );
}
