"use client";

import { Suspense, useState } from "react";

import LoginStep1 from "./_components/login-step-1";
import LoginStep2 from "./_components/login-step-2";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loginTicket, setLoginTicket] = useState<string | null>(null);

  return (
    <>
      <div className="page-title">{"<Login>"}</div>
      <div className="global-container">
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
      </div>
    </>
  );
}
