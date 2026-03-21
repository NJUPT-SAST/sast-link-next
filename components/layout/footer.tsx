import type { ReactNode } from "react";

export function Footer({ children }: { children: ReactNode }) {
  return (
    <footer className="flex h-[calc(85px+8.8vh)] min-h-[150px] max-h-[180px] w-[330px] flex-col items-center gap-3">
      {children}
    </footer>
  );
}
