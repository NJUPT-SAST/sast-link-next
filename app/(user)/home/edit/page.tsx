"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useFilePicker } from "use-file-picker";
import AvatarEditor from "react-avatar-editor";
import { Camera } from "lucide-react";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { uploadAvatar, editProfile } from "@/lib/api/user";
import { message } from "@/lib/message";
import { departmentMap } from "@/lib/constants/department";
import { BackButton } from "@/components/navigation/back-button";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { DotLoading } from "@/components/ui/dot-loading";

interface FormValues {
  nickname: string;
  bio: string;
  link1: string;
  link2: string;
  link3: string;
}

export default function EditPage() {
  const profile = useUserProfileStore((s) => s.profile);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cropperRef = useRef<any>(null);

  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      nickname: profile.nickname,
      bio: profile.bio ?? "",
      link1: profile.link?.[0] ?? "",
      link2: profile.link?.[1] ?? "",
      link3: profile.link?.[2] ?? "",
    },
  });

  const { openFilePicker } = useFilePicker({
    accept: "image/*",
    onFilesSuccessfullySelected: (files: { plainFiles: File[] }) => {
      setAvatarFile(files.plainFiles[0]);
    },
  });

  useEffect(() => {
    setValue("nickname", profile.nickname);
    setValue("bio", profile.bio ?? "");
    setValue("link1", profile.link?.[0] ?? "");
    setValue("link2", profile.link?.[1] ?? "");
    setValue("link3", profile.link?.[2] ?? "");
  }, [profile, setValue]);

  const handleAvatarUpload = () => {
    setUploadLoading(true);
    if (cropperRef.current) {
      const canvas = cropperRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          uploadAvatar(blob)
            .then(() => {
              message.success("上传成功, 审核中");
              setAvatarFile(null);
              router.refresh();
            })
            .catch(() => message.error("上传失败"))
            .finally(() => setUploadLoading(false));
        }
      });
    }
  };

  const onSubmit = (form: FormValues) => {
    setUpdateLoading(true);
    editProfile({
      nickname: form.nickname,
      bio: form.bio,
      link: [form.link1, form.link2, form.link3],
    })
      .then(() => message.success("修改成功"))
      .catch(() => message.error("修改失败"))
      .finally(() => setUpdateLoading(false));
  };

  if (avatarFile) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <AvatarEditor
          ref={cropperRef}
          image={avatarFile}
          width={200}
          height={200}
          border={50}
          color={[255, 255, 255, 0.6]}
          scale={avatarScale}
          rotate={0}
          borderRadius={100}
        />
        <input
          type="range"
          min={1}
          max={5}
          step={0.01}
          value={avatarScale}
          onChange={(e) => setAvatarScale(Number(e.target.value))}
          className="w-64"
        />
        <button
          onClick={handleAvatarUpload}
          disabled={uploadLoading}
          className="flex h-[42px] w-[314px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-xl font-semibold text-white disabled:opacity-50"
        >
          {uploadLoading ? <DotLoading /> : "确认提交"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Avatar Section */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <BackButton />
        <h3 className="text-lg font-semibold">头像设置</h3>
        <div className="flex justify-center">
          <div className="h-[145px] w-[145px] overflow-hidden rounded-full">
            <Image
              src={profile.avatar ?? "/defaultAvatar.png"}
              alt="avatar"
              width={145}
              height={145}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <button
          onClick={() => openFilePicker()}
          className="flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-lg font-semibold text-white"
        >
          <Camera size={20} />
          更换头像
        </button>
      </div>

      {/* Edit Info Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold">编辑信息</h3>
        <InputWithLabel
          label="昵称"
          name="nickname"
          error={{ error: false }}
          inputProps={register("nickname")}
          className="rounded-lg border-4 border-black px-3.5 py-2"
        />
        <InputWithLabel
          label="个人简介"
          name="bio"
          error={{ error: false }}
          inputProps={register("bio")}
          className="rounded-lg border-4 border-black px-3.5 py-2"
        />

        <h3 className="text-lg font-semibold">社交链接</h3>
        <InputWithLabel
          label="社交链接"
          name="link1"
          error={{ error: false }}
          inputProps={register("link1")}
          className="rounded-lg border-4 border-black px-3.5 py-2"
        />
        <InputWithLabel
          label="社交链接"
          name="link2"
          error={{ error: false }}
          inputProps={register("link2")}
          className="rounded-lg border-4 border-black px-3.5 py-2"
        />
        <InputWithLabel
          label="社交链接"
          name="link3"
          error={{ error: false }}
          inputProps={register("link3")}
          className="rounded-lg border-4 border-black px-3.5 py-2"
        />

        <button
          type="submit"
          disabled={updateLoading}
          className="flex h-[42px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-[#1c1f23] bg-[#1c1f23] text-lg font-semibold text-white disabled:opacity-50"
        >
          {updateLoading ? <DotLoading /> : "提交"}
        </button>
      </form>
    </div>
  );
}
