"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepProfile } from "./step-profile";
import { StepFirstAccount } from "./step-first-account";
import { StepFirstSubscription } from "./step-first-subscription";

interface Props {
  userId: string;
  userName: string;
}

export function OnboardingWizard({ userId, userName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const steps = [
    { label: "Profil", num: 1 },
    { label: "Rekening", num: 2 },
    { label: "Subscription", num: 3 },
  ];

  function next() {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <a href="/" className="text-2xl font-bold" style={{ color: "var(--forest-800)", fontFamily: "var(--font-display)" }}>
          Aliran
        </a>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-500)" }}>
          Selamat datang! Setup cepat sebelum mulai.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors"
              style={{
                background: step >= s.num ? "var(--forest-700)" : "var(--cream-300)",
                color: step >= s.num ? "white" : "var(--ink-400)",
              }}
            >
              {s.num}
            </div>
            <span className="text-xs" style={{ color: step === s.num ? "var(--ink-700)" : "var(--ink-400)" }}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="w-8 h-px" style={{ background: "var(--line)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && <StepProfile userId={userId} defaultName={userName} onNext={next} />}
      {step === 2 && <StepFirstAccount userId={userId} onNext={next} />}
      {step === 3 && <StepFirstSubscription userId={userId} onNext={next} />}
    </div>
  );
}
