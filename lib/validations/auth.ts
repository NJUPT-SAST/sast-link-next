import { z } from "zod/v3";

const studentIdPattern = /^\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const verificationCodePattern = /^\d{5}$/;
const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const loginAccountSchema = z
  .string()
  .trim()
  .min(1, "账户不可为空")
  .refine(
    (value) => studentIdPattern.test(value) || emailPattern.test(value),
    "请输入学号或邮箱",
  );

export const loginPasswordSchema = z.string().trim().min(1, "密码不可为空");

export const registerStudentIdSchema = z
  .string()
  .trim()
  .min(1, "学号不可为空")
  .regex(studentIdPattern, "请输入 9 位学号");

export const verificationCodeSchema = z
  .string()
  .trim()
  .min(1, "验证码不可为空")
  .regex(verificationCodePattern, "请输入 5 位验证码");

export const passwordSchema = z
  .string()
  .min(1, "密码不可为空")
  .regex(strongPasswordPattern, "密码至少 8 位且需同时包含字母和数字");

export const registerPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "密码不一致",
    path: ["confirmPassword"],
  });

export const loginAccountFormSchema = z.object({
  username: loginAccountSchema,
});

export const loginPasswordFormSchema = z.object({
  password: loginPasswordSchema,
});

export const registerStudentIdFormSchema = z.object({
  studentId: registerStudentIdSchema,
});

export const verificationCodeFormSchema = z.object({
  captcha: verificationCodeSchema,
});

export type LoginAccountFormValues = z.infer<typeof loginAccountFormSchema>;
export type LoginPasswordFormValues = z.infer<typeof loginPasswordFormSchema>;
export type RegisterStudentIdFormValues = z.infer<
  typeof registerStudentIdFormSchema
>;
export type VerificationCodeFormValues = z.infer<
  typeof verificationCodeFormSchema
>;
export type RegisterPasswordFormValues = z.infer<
  typeof registerPasswordSchema
>;

export function studentIdToEmail(studentId: string) {
  return `${studentId.trim()}@njupt.edu.cn`;
}
