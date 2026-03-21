"use client";

import { Suspense, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import LoginStep1 from "./_components/login-step-1";
import LoginStep2 from "./_components/login-step-2";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loginTicket, setLoginTicket] = useState<string | null>(null);

  return (
    <AuthShell
      title="<Login>"
      description="使用你的 SAST Link 账号继续，支持学号或邮箱登录。"
    >
      <Suspense>
        {step === 1 ? (
          <LoginStep1
            onNext={(ticket) => {
              setLoginTicket(ticket);
              setStep(2);
            }}
          />
        ) : (
          <LoginStep2
            loginTicket={loginTicket!}
            onBack={() => setStep(1)}
          />
        )}
      </Suspense>
    </AuthShell>
  );
}
