"use client";

import { Suspense, useCallback, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { PageTransition } from "@/components/animation/page-transition";
import RegisterStep1 from "./_components/register-step-1";
import RegisterStep2 from "./_components/register-step-2";
import RegisterStep3 from "./_components/register-step-3";
import RegisterStep4 from "./_components/register-step-4";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [registerTicket, setRegisterTicket] = useState("");
  const [username, setUsername] = useState("");

  const nextStep = useCallback(() => setStep((s) => s + 1), []);

  return (
    <AuthShell
      title="<Register>"
      description="完成邮箱验证与密码设置后即可开始使用 SAST Link。"
    >
      <Suspense>
        {step === 1 && (
          <PageTransition>
            <RegisterStep1
              onNext={nextStep}
              onTicket={setRegisterTicket}
              onUsername={setUsername}
            />
          </PageTransition>
        )}
        {step === 2 && (
          <PageTransition>
            <RegisterStep2
              username={username}
              ticket={registerTicket}
              onTicket={setRegisterTicket}
              onNext={nextStep}
            />
          </PageTransition>
        )}
        {step === 3 && (
          <PageTransition>
            <RegisterStep3
              ticket={registerTicket}
              onNext={nextStep}
            />
          </PageTransition>
        )}
        {step === 4 && (
          <PageTransition>
            <RegisterStep4 />
          </PageTransition>
        )}
      </Suspense>
    </AuthShell>
  );
}
