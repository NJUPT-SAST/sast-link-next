"use client";

import { Suspense, useCallback, useState } from "react";

import { PageTransition } from "@/components/animation/page-transition";
import ResetStep1 from "./_components/reset-step-1";
import ResetStep2 from "./_components/reset-step-2";
import ResetStep3 from "./_components/reset-step-3";
import ResetStep4 from "./_components/reset-step-4";

export default function ResetPage() {
  const [step, setStep] = useState(1);
  const [resetTicket, setResetTicket] = useState("");
  const [username, setUsername] = useState("");

  const nextStep = useCallback(() => setStep((s) => s + 1), []);

  return (
    <>
      <div className="page-title">{"<ResetPassword>"}</div>
      <div className="global-container">
        <Suspense>
          {step === 1 && (
            <PageTransition>
              <ResetStep1
                onNext={nextStep}
                onTicket={setResetTicket}
                onUsername={setUsername}
              />
            </PageTransition>
          )}
          {step === 2 && (
            <PageTransition>
              <ResetStep2
                username={username}
                ticket={resetTicket}
                onTicket={setResetTicket}
                onNext={nextStep}
              />
            </PageTransition>
          )}
          {step === 3 && (
            <PageTransition>
              <ResetStep3 ticket={resetTicket} onNext={nextStep} />
            </PageTransition>
          )}
          {step === 4 && (
            <PageTransition>
              <ResetStep4 />
            </PageTransition>
          )}
        </Suspense>
      </div>
    </>
  );
}
