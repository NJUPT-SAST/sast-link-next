"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { userRegister } from "@/lib/api/auth";
import {
  type RegisterPasswordFormValues,
  registerPasswordSchema,
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
import { Footer } from "@/components/layout/footer";

interface Props {
  ticket: string;
  onNext: () => void;
}

export default function RegisterStep3({ ticket, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterPasswordFormValues>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit(async ({ password }) => {
    setLoading(true);

    try {
      const res = await userRegister(password, ticket);
      if (res.data.Success) {
        onNext();
        return;
      }

      form.setError("password", {
        message: res.data.ErrMsg,
      });
    } catch {
      form.setError("password", {
        message: "网络错误",
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6 px-8 pt-8"
      >
        <div className="flex w-full flex-col gap-4">
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
                  placeholder="设置密码"
                  autoComplete="new-password"
                  invalid={!!fieldState.error}
                  description="请使用至少 8 位且同时包含字母和数字的密码。"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem className="w-full space-y-2">
                <AuthFormField
                  {...field}
                  ref={field.ref}
                  label="确认密码"
                  type="password"
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                  invalid={!!fieldState.error}
                  description="请勿在公共设备保存密码，并在提交前确认两次输入完全一致。"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Footer>
          <Button
            type="submit"
            disabled={loading}
            className="h-[42px] w-[314px] rounded-[10px] border-[3px] border-[#1c1f23] text-base font-semibold sm:text-xl"
          >
            {loading ? <DotLoading /> : "下一步"}
          </Button>
        </Footer>
      </form>
    </Form>
  );
}
