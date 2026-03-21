"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { verifyCaptcha, verifyRegistAccount, sendMail } from "@/lib/api/auth";
import {
  type VerificationCodeFormValues,
  verificationCodeFormSchema,
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
  const form = useForm<VerificationCodeFormValues>({
    resolver: zodResolver(verificationCodeFormSchema),
    defaultValues: {
      captcha: "",
    },
  });

  const handleSubmit = form.handleSubmit(async ({ captcha }) => {
    setLoading(true);

    try {
      const res = await verifyCaptcha(ticket, captcha);
      if (res.data.Success) {
        onNext();
        return;
      }

      form.setError("captcha", {
        message: res.data.ErrMsg,
      });
    } catch {
      form.setError("captcha", {
        message: "网络错误",
      });
    } finally {
      setLoading(false);
    }
  });

  const handleResend = async () => {
    const res = await verifyRegistAccount(username);
    if (res.data.Success) {
      const newTicket = res.data.Data.registerTicket;
      onTicket(newTicket);
      await sendMail(newTicket);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6 px-8 pt-8"
      >
        <FormField
          control={form.control}
          name="captcha"
          render={({ field, fieldState }) => {
            const { ref, ...fieldProps } = field;

            return (
              <FormItem className="w-full space-y-2">
                <div className="flex items-start gap-1">
                  <span className="pt-[30px] text-xl font-semibold text-[#1c1f23]">
                    S-
                  </span>
                  <AuthFormField
                    {...fieldProps}
                    ref={ref}
                    containerClassName="flex-1"
                    label="验证码"
                    placeholder="5 位验证码"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={5}
                    invalid={!!fieldState.error}
                    suffix={<VeriCode onResend={handleResend} />}
                    description={`验证码已发送至 ${username}，该验证码短时有效，且仅应由邮箱持有人使用。`}
                  />
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />

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
