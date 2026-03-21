"use client";

import { useState, useEffect, useRef, type WheelEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useFilePicker } from "use-file-picker";
import AvatarEditor from "react-avatar-editor";
import { Camera, ZoomIn, ZoomOut } from "lucide-react";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { uploadAvatar, editProfile } from "@/lib/api/user";
import { message } from "@/lib/message";
import {
  type ProfileFormValues,
  profileRules,
} from "@/lib/validations/profile";
import { BackButton } from "@/components/navigation/back-button";
import { DotLoading } from "@/components/ui/dot-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

const AVATAR_SCALE_MIN = 1;
const AVATAR_SCALE_MAX = 5;
const AVATAR_SCALE_STEP = 0.01;
const AVATAR_WHEEL_STEP = 0.1;

function clampAvatarScale(value: number) {
  return Math.min(AVATAR_SCALE_MAX, Math.max(AVATAR_SCALE_MIN, value));
}

export default function EditPage() {
  const profile = useUserProfileStore((s) => s.profile);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarScale, setAvatarScale] = useState(AVATAR_SCALE_MIN);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cropperRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
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
      setAvatarScale(AVATAR_SCALE_MIN);
    },
  });

  useEffect(() => {
    reset({
      nickname: profile.nickname,
      bio: profile.bio ?? "",
      link1: profile.link?.[0] ?? "",
      link2: profile.link?.[1] ?? "",
      link3: profile.link?.[2] ?? "",
    });
  }, [profile, reset]);

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

  const onSubmit = (data: ProfileFormValues) => {
    setUpdateLoading(true);
    editProfile({
      nickname: data.nickname,
      bio: data.bio,
      link: [data.link1, data.link2, data.link3],
    })
      .then(() => message.success("修改成功"))
      .catch(() => message.error("修改失败"))
      .finally(() => setUpdateLoading(false));
  };

  const handleAvatarWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!avatarFile) {
      return;
    }

    event.preventDefault();
    event.nativeEvent.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;

    setAvatarScale((current) =>
      clampAvatarScale(current + direction * AVATAR_WHEEL_STEP),
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <BackButton />

      {/* Avatar Section */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>头像设置</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="size-36 border-2 border-foreground/20">
            <AvatarImage
              src={profile.avatar ?? "/defaultAvatar.png"}
              alt="avatar"
            />
            <AvatarFallback className="text-3xl">
              {profile.nickname?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => openFilePicker()}>
            <Camera size={16} />
            更换头像
          </Button>
        </CardFooter>
      </Card>

      {/* Avatar Cropper Dialog */}
      <Dialog
        open={!!avatarFile}
        onOpenChange={(open) => {
          if (!open) setAvatarFile(null);
        }}
      >
          <DialogContent className="border-border/60 bg-card/95 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>裁剪头像</DialogTitle>
            <DialogDescription>拖动和缩放以调整头像</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {avatarFile && (
              <div onWheel={handleAvatarWheel}>
                <AvatarEditor
                  ref={cropperRef}
                  image={avatarFile}
                  width={200}
                  height={200}
                  border={40}
                  color={[0, 0, 0, 0.5]}
                  scale={avatarScale}
                  rotate={0}
                  borderRadius={100}
                />
              </div>
            )}
            <div className="flex w-full items-center gap-3 px-4">
              <ZoomOut size={16} className="shrink-0 text-muted-foreground" />
              <Slider
                min={AVATAR_SCALE_MIN}
                max={AVATAR_SCALE_MAX}
                step={AVATAR_SCALE_STEP}
                value={[avatarScale]}
                onValueChange={([v]) => setAvatarScale(clampAvatarScale(v))}
              />
              <ZoomIn size={16} className="shrink-0 text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvatarFile(null)}>
              取消
            </Button>
            <Button onClick={handleAvatarUpload} disabled={uploadLoading}>
              {uploadLoading ? <DotLoading /> : "确认提交"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Info Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>编辑信息</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input
                id="nickname"
                placeholder="输入昵称"
                {...register("nickname", profileRules.nickname)}
              />
              {errors.nickname && (
                <p className="text-sm text-destructive">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">个人简介</Label>
              <Input
                id="bio"
                placeholder="介绍一下自己"
                {...register("bio", profileRules.bio)}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="text-sm font-medium text-muted-foreground">
              社交链接
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link1">链接 1</Label>
              <Input
                id="link1"
                placeholder="https://"
                {...register("link1", profileRules.link1)}
              />
              {errors.link1 && (
                <p className="text-sm text-destructive">
                  {errors.link1.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link2">链接 2</Label>
              <Input
                id="link2"
                placeholder="https://"
                {...register("link2", profileRules.link2)}
              />
              {errors.link2 && (
                <p className="text-sm text-destructive">
                  {errors.link2.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link3">链接 3</Label>
              <Input
                id="link3"
                placeholder="https://"
                {...register("link3", profileRules.link3)}
              />
              {errors.link3 && (
                <p className="text-sm text-destructive">
                  {errors.link3.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? <DotLoading /> : "提交"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
