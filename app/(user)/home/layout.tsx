"use client";

import type { ReactNode } from "react";

import { BackLayout } from "@/components/layout/back-layout";
import { TopBar } from "@/components/layout/top-bar";
import { PageTransition } from "@/components/animation/page-transition";
import { useFetchProfile } from "@/hooks/use-fetch-profile";

export default function HomeLayout({
  children,
  infoPanel,
  appPanel,
  profilePanel,
}: {
  children: ReactNode;
  infoPanel: ReactNode;
  appPanel: ReactNode;
  profilePanel: ReactNode;
}) {
  // Replace @getInfo parallel route with a hook
  useFetchProfile();

  return (
    <>
      <BackLayout type="yellow" />
      <TopBar />
      <PageTransition
        className="flex w-screen justify-center px-5"
        position="bottomToTop"
      >
        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-[360px_1fr]">
          <div className="flex flex-col gap-5">
            {profilePanel}
            {infoPanel}
          </div>
          <div className="flex flex-col gap-5">{children}</div>
        </div>
      </PageTransition>
      {appPanel}
    </>
  );
}
