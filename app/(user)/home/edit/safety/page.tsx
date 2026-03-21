"use client";

import { useUserProfileStore } from "@/store/use-user-profile-store";
import { message } from "@/lib/message";
import { BackButton } from "@/components/navigation/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function SafetyPage() {
  const email = useUserProfileStore((s) => s.profile.email);

  return (
    <div className="flex w-full flex-col gap-4">
      <BackButton />
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>邮箱设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              defaultValue={email}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => message.warning("功能未开放")}
          >
            重新绑定
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
