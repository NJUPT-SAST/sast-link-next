"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { verifyLoginAccount } from "@/lib/api/auth";
import { message } from "@/lib/message";
import {
  type LoginAccountFormValues,
  loginAccountFormSchema,
} from "@/lib/validations/auth";
import { AuthFormField } from "@/components/auth/auth-form-field";
import { DotLoading } from "@/components/ui/dot-loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { OtherLoginList } from "@/components/auth/other-login-list";
import { GithubIcon, QqIcon, MsIcon } from "@/components/icons/brand-icons";
import { PageTransition } from "@/components/animation/page-transition";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface LoginStep1Props {
  onNext: (ticket: string) => void;
}

export default function LoginStep1({ onNext }: LoginStep1Props) {
  const [loading, setLoading] = useState(false);
  const urlParams = useSearchParams();
  const form = useForm<LoginAccountFormValues>({
    resolver: zodResolver(loginAccountFormSchema),
    defaultValues: {
      username: "",
    },
  });

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

  useEffect(() => {
    if (urlParams.get("oauthTicket")) {
      message.warning("请先绑定账号");
    }
  }, [urlParams]);

  const isOAuthBinding = !!urlParams.get("oauthTicket");

  const handleSubmit = form.handleSubmit(async ({ username }) => {
    setLoading(true);

    try {
      const res = await verifyLoginAccount(username.trim());
      if (res.data.Success) {
        onNext(res.data.Data.loginTicket);
        return;
      }

      form.setError("username", {
        message: res.data.ErrMsg,
      });
    } catch {
      form.setError("username", {
        message: "网络错误",
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <PageTransition className="flex w-full flex-col items-center gap-4 px-8 pt-8">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFormField
                  {...field}
                  ref={field.ref}
                  label="账户"
                  placeholder="学号或邮箱"
                  autoComplete="username"
                  invalid={!!fieldState.error}
                  description="请输入 9 位学号或常用邮箱地址。"
                />
                <div className="flex justify-end">
                  <Link
                    href="/reset"
                    className="text-sm text-[#808080] hover:underline"
                  >
                    忘记密码
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="h-[42px] w-[314px] self-center rounded-[10px] border-[3px] border-[#1c1f23] text-base font-semibold sm:text-xl"
          >
            {loading ? (
              <DotLoading />
            ) : isOAuthBinding ? (
              "绑定账号"
            ) : (
              "下一步"
            )}
          </Button>
        </form>
      </Form>

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
