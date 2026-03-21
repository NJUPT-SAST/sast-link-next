"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserPen, ShieldCheck } from "lucide-react";

import { usePanelStore } from "@/store/use-panel-store";
import { useUserProfileStore } from "@/store/use-user-profile-store";
import { message } from "@/lib/message";
import { clearToken } from "@/lib/token";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function InfoPanel() {
  const { homeInfoPanel, setHomeInfoPanel } = usePanelStore();
  const resetProfile = useUserProfileStore((s) => s.resetProfile);
  const router = useRouter();

  const handleLogout = () => {
    resetProfile();
    clearToken();
    localStorage.removeItem("user-list-store");
    localStorage.removeItem("auth-store");
    message.success("退出成功");
    setHomeInfoPanel(false);
    router.replace("/login");
  };

  return (
    <>
      <Sheet open={homeInfoPanel} onOpenChange={setHomeInfoPanel}>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>账户</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            <Button
              variant="ghost"
              className="justify-start gap-3"
              asChild
              onClick={() => setHomeInfoPanel(false)}
            >
              <Link href="/home/edit">
                <UserPen size={18} />
                编辑信息
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3"
              asChild
              onClick={() => setHomeInfoPanel(false)}
            >
              <Link href="/home/edit/safety">
                <ShieldCheck size={18} />
                安全设置
              </Link>
            </Button>
          </nav>
          <SheetFooter className="mt-auto">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              退出登录
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
