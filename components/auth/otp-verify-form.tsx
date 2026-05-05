"use client";

import {
  RiCheckboxCircleLine,
  RiLoader4Line,
  RiRefreshLine,
  RiTimeLine,
} from "@remixicon/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN = 60;
const OTP_LENGTH = 6;

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      role="alert"
      className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm"
    >
      {message}
    </div>
  );
}

function SuccessState() {
  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <CardTitle>Email verified</CardTitle>
        <CardDescription>Your account is ready</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <RiCheckboxCircleLine aria-hidden className="size-8 text-primary" />
          </div>
          <p className="font-medium text-sm">You&apos;re all set! Redirecting…</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OtpVerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [generalError, setGeneralError] = useState<string>();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length < OTP_LENGTH) return;

      setGeneralError(undefined);
      setIsLoading(true);

      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
      });

      setIsLoading(false);

      if (error) {
        setGeneralError(
          error.code === "INVALID_OTP"
            ? "Invalid code. Please try again."
            : error.code === "OTP_EXPIRED"
              ? "Code has expired. Please request a new one."
              : error.code === "TOO_MANY_REQUESTS"
                ? "Too many attempts. Please wait and request a new code."
                : (error.message ?? "Verification failed. Please try again."),
        );
        setOtp("");
        return;
      }

      setVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => router.push("/dashboard"), 1200);
    },
    [email, router],
  );

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setGeneralError(undefined);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    setIsResending(false);

    if (error) {
      setGeneralError(error.message ?? "Failed to resend code.");
      return;
    }

    setCooldown(RESEND_COOLDOWN);
    toast.success("A new code has been sent to your email.");
  }, [cooldown, isResending, email]);

  if (verified) return <SuccessState />;

  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {generalError && <ErrorAlert message={generalError} />}

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              setGeneralError(undefined);
              if (val.length === OTP_LENGTH) handleVerify(val);
            }}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-center text-muted-foreground text-sm">
            Enter the 6-digit code from your email
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <RiLoader4Line aria-hidden className="size-4 animate-spin" />
            Verifying…
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="min-h-[44px] w-full touch-manipulation"
          disabled={cooldown > 0 || isResending}
          aria-busy={isResending}
          onClick={handleResend}
        >
          {isResending ? (
            <>
              <RiLoader4Line aria-hidden className="size-4 animate-spin" />
              Sending…
            </>
          ) : cooldown > 0 ? (
            <>
              <RiTimeLine aria-hidden className="size-4" />
              Resend in {cooldown}s
            </>
          ) : (
            <>
              <RiRefreshLine aria-hidden className="size-4" />
              Resend code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
