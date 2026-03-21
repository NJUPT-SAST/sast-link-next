"use client";

import { PageTransition } from "@/components/animation/page-transition";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTransition
      position="bottomToTop"
      className="flex w-full justify-center"
    >
      {children}
    </PageTransition>
  );
}
