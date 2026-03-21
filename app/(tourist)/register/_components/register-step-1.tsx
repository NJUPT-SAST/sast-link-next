"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { verifyRegistAccount, sendMail } from "@/lib/api/auth";
import {
  type RegisterStudentIdFormValues,
  registerStudentIdFormSchema,
  studentIdToEmail,
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
  onNext: () => void;
  onTicket: (ticket: string) => void;
  onUsername: (username: string) => void;
}

export default function RegisterStep1({ onNext, onTicket, onUsername }: Props) {
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterStudentIdFormValues>({
    resolver: zodResolver(registerStudentIdFormSchema),
    defaultValues: {
      studentId: "",
    },
  });

  const handleSubmit = form.handleSubmit(async ({ studentId }) => {
    setLoading(true);

    const mail = studentIdToEmail(studentId);
    onUsername(mail);

    try {
      const res = await verifyRegistAccount(mail);
      if (res.data.Success) {
        const ticket = res.data.Data.registerTicket;
        onTicket(ticket);

        const mailRes = await sendMail(ticket);
        if (mailRes.data.Success) {
          onNext();
          return;
        }

        form.setError("studentId", {
          message: mailRes.data.ErrMsg,
        });
        return;
      }

      form.setError("studentId", {
        message: res.data.ErrMsg,
      });
    } catch {
      form.setError("studentId", {
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
        <FormField
          control={form.control}
          name="studentId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full space-y-2">
              <AuthFormField
                {...field}
                ref={field.ref}
                label="学生邮箱"
                placeholder="9 位学号"
                autoComplete="username"
                inputMode="numeric"
                maxLength={9}
                invalid={!!fieldState.error}
                suffix={<span>@njupt.edu.cn</span>}
                description="请输入你的 9 位学号，我们会自动补全校内邮箱地址并发送验证邮件。"
              />
              <FormMessage />
            </FormItem>
          )}
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
