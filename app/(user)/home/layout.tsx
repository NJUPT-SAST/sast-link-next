"use client";

import type { ReactNode } from "react";

import { BackLayout } from "@/components/layout/back-layout";
import { TopBar } from "@/components/layout/top-bar";
import { PageTransition } from "@/components/animation/page-transition";
import { useFetchProfile } from "@/hooks/use-fetch-profile";

export default function HomeLayout({
  children,
  infoPanel,
  profilePanel,
}: {
  children: ReactNode;
  infoPanel: ReactNode;
  profilePanel: ReactNode;
}) {
  useFetchProfile();

  return (
    <>
      <BackLayout type="yellow" />
      <TopBar />
      <PageTransition
        className="flex w-screen justify-center px-4 pb-4 pt-2 md:px-6"
        position="bottomToTop"
      >
        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_320px] xl:items-start">
          <div className="order-1 flex flex-col gap-5">{children}</div>
          <div className="order-2 flex flex-col gap-4">
            {profilePanel}
            {infoPanel}
          </div>
        </div>
      </PageTransition>
    </>
  );
}
