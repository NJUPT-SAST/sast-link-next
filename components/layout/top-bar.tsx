"use client";

import { usePanelStore } from "@/store/use-panel-store";
import { useUserProfileStore } from "@/store/use-user-profile-store";
import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

export function TopBar() {
  const setHomeInfoPanel = usePanelStore((s) => s.setHomeInfoPanel);
  const profile = useUserProfileStore((s) => s.profile);

  return (
    <>
      <div className="fixed top-0 left-0 z-10 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/80 px-5 shadow-[0px_4px_30px_0px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="text-foreground">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setHomeInfoPanel(true)}
            aria-label="Open profile"
          >
            <Avatar className="size-8">
              <AvatarImage
                src={profile.avatar ?? "/defaultAvatar.png"}
                alt="avatar"
              />
              <AvatarFallback>
                {profile.nickname?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
      {/* Spacer */}
      <div className="h-14 w-px" />
    </>
  );
}
