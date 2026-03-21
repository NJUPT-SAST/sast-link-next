import type { RegisterOptions } from "react-hook-form";

export interface ProfileFormValues {
  nickname: string;
  bio: string;
  link1: string;
  link2: string;
  link3: string;
}

const urlPattern =
  /^$|^https?:\/\/.+/;

export const profileRules: Record<
  keyof ProfileFormValues,
  RegisterOptions<ProfileFormValues>
> = {
  nickname: {
    required: "昵称不能为空",
    maxLength: { value: 20, message: "昵称最多20个字符" },
  },
  bio: {
    maxLength: { value: 200, message: "简介最多200个字符" },
  },
  link1: {
    pattern: { value: urlPattern, message: "请输入有效的URL" },
  },
  link2: {
    pattern: { value: urlPattern, message: "请输入有效的URL" },
  },
  link3: {
    pattern: { value: urlPattern, message: "请输入有效的URL" },
  },
};
