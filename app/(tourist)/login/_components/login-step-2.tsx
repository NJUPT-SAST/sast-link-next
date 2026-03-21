"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { userLogin, getUserInfo } from "@/lib/api/user";
import { setToken } from "@/lib/token";
import { useUserListStore } from "@/store/use-user-list-store";
import {
  type LoginPasswordFormValues,
  loginPasswordFormSchema,
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
import { PageTransition } from "@/components/animation/page-transition";
import { Footer } from "@/components/layout/footer";

interface LoginStep2Props {
  loginTicket: string;
  onBack: () => void;
}

export default function LoginStep2({ loginTicket, onBack }: LoginStep2Props) {
  const router = useRouter();
  const urlParams = useSearchParams();
  const addAccount = useUserListStore((s) => s.addAccount);
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginPasswordFormValues>({
    resolver: zodResolver(loginPasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const redirectUri = urlParams.get("redirect")
    ? atob(urlParams.get("redirect")!)
    : "";

  const handleSubmit = form.handleSubmit(async ({ password }) => {
    setLoading(true);

    try {
      const res = await userLogin(password, loginTicket, urlParams.get("oauthTicket"));
      if (res.data.Success) {
        const token = res.data.Data.loginToken;
        setToken(token);

        const infoRes = await getUserInfo();
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

        form.setError("password", {
          message: infoRes.data.ErrMsg,
        });
        return;
      }

      if (res.data.ErrCode === 20007) {
        onBack();
        return;
      }

      form.setError("password", {
        message: res.data.ErrMsg,
      });
    } catch (err) {
      if ((err as { response?: { status?: number } })?.response?.status === 401) {
        form.setError("password", {
          message: "密码错误，请重新输入密码",
        });
      } else {
        form.setError("password", {
          message: "网络错误",
        });
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <PageTransition className="flex w-full flex-col items-center gap-4 px-8 pt-8">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="w-full space-y-2">
                <AuthFormField
                  {...field}
                  ref={field.ref}
                  label="密码"
                  type="password"
                  placeholder="密码"
                  autoComplete={urlParams.get("oauthTicket") ? "new-password" : "current-password"}
                  invalid={!!fieldState.error}
                  description="请勿在公共设备保存密码，输入后我们会继续完成当前登录流程。"
                />
                <div className="flex justify-end">
                  <Link
                    href="/reset"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    忘记密码
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Footer>
            <Button
              type="submit"
              disabled={loading}
              className="h-[42px] w-[314px] rounded-[10px] border-[3px] border-primary text-base font-semibold sm:text-xl"
            >
              {loading ? (
                <DotLoading />
              ) : redirectUri ? (
                "登录并前往授权"
              ) : (
                "登录 SAST Link"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="h-[42px] w-[314px] rounded-[10px] border-[3px] border-primary bg-background text-base font-semibold text-foreground hover:bg-accent sm:text-xl"
            >
              使用其他账号
            </Button>
          </Footer>
        </form>
      </Form>
    </PageTransition>
  );
}
