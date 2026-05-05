"use client";

import {
  RiCheckboxCircleLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
  RiLockLine,
} from "@remixicon/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/client";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTP_LENGTH = 6;

function validatePassword(v: string) {
  if (!v) return "Password is required";
  if (v.length < 8) return "Password must be at least 8 characters";
}

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
        <CardTitle>Password updated</CardTitle>
        <CardDescription>You can now sign in with your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <RiCheckboxCircleLine aria-hidden className="size-6 text-primary" />
          </div>
          <p className="font-medium text-sm">Password reset successfully. Redirecting…</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [generalError, setGeneralError] = useState<string>();
  const [done, setDone] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (otp.length < OTP_LENGTH) {
      setGeneralError("Please enter the 6-digit code from your email.");
      return;
    }

    const passErr = validatePassword(password);
    const confirmErr = password !== confirm ? "Passwords do not match" : undefined;
    if (passErr || confirmErr) {
      setFieldErrors({ password: passErr, confirm: confirmErr });
      return;
    }

    if (!email) {
      setGeneralError("Missing email. Please restart the password reset flow.");
      return;
    }

    setFieldErrors({});
    setGeneralError(undefined);
    setIsLoading(true);

    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });

    setIsLoading(false);

    if (error) {
      setGeneralError(
        error.code === "INVALID_OTP"
          ? "Invalid code. Please check and try again."
          : error.code === "OTP_EXPIRED"
            ? "Code has expired. Please request a new one."
            : error.code === "PASSWORD_COMPROMISED"
              ? "This password has appeared in known data breaches. Please choose a different one."
              : (error.message ?? "Something went wrong. Please try again."),
      );
      return;
    }

    setDone(true);
    toast.success("Password reset successfully!");
    setTimeout(() => router.push("/sign-in"), 1500);
  }, [otp, password, confirm, email, router]);

  if (done) return <SuccessState />;

  if (!email) {
    return (
      <Card className="w-full shadow-xs">
        <CardHeader>
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>Email address is missing</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAlert message="Please restart the password reset flow from the sign-in page." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>
          Enter the code sent to <span className="font-medium text-foreground">{email}</span> and your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          {generalError && <ErrorAlert message={generalError} />}

          {/* OTP */}
          <div className="flex flex-col items-center gap-3">
            <p className="self-start text-sm font-medium">Reset code</p>
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={(val) => { setOtp(val); setGeneralError(undefined); }}
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
          </div>

          <div className="flex flex-col gap-4">
            <Field data-invalid={!!fieldErrors.password}>
              <FieldLabel htmlFor="rp-password">
                New password <span aria-label="required" className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <InputGroup aria-invalid={!!fieldErrors.password}>
                  <InputGroupAddon>
                    <RiLockLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="rp-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters…"
                    required
                    value={password}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "rp-password-error" : undefined}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password)
                        setFieldErrors((p) => ({ ...p, password: validatePassword(e.target.value) }));
                    }}
                  />
                  <InputGroupButton
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="min-h-[32px] min-w-[32px] touch-manipulation"
                    onClick={(e) => { e.preventDefault(); setShowPassword((v) => !v); }}
                  >
                    {showPassword
                      ? <RiEyeOffLine aria-hidden className="size-4" />
                      : <RiEyeLine aria-hidden className="size-4" />}
                  </InputGroupButton>
                </InputGroup>
                {fieldErrors.password && (
                  <FieldError id="rp-password-error">{fieldErrors.password}</FieldError>
                )}
              </FieldContent>
            </Field>

            <Field data-invalid={!!fieldErrors.confirm}>
              <FieldLabel htmlFor="rp-confirm">
                Confirm password <span aria-label="required" className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <InputGroup aria-invalid={!!fieldErrors.confirm}>
                  <InputGroupAddon>
                    <RiLockLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="rp-confirm"
                    type={showConfirm ? "text" : "password"}
                    name="confirm-password"
                    autoComplete="new-password"
                    placeholder="Repeat your password…"
                    required
                    value={confirm}
                    aria-invalid={!!fieldErrors.confirm}
                    aria-describedby={fieldErrors.confirm ? "rp-confirm-error" : undefined}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      if (fieldErrors.confirm)
                        setFieldErrors((p) => ({
                          ...p,
                          confirm: e.target.value !== password ? "Passwords do not match" : undefined,
                        }));
                    }}
                  />
                  <InputGroupButton
                    type="button"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="min-h-[32px] min-w-[32px] touch-manipulation"
                    onClick={(e) => { e.preventDefault(); setShowConfirm((v) => !v); }}
                  >
                    {showConfirm
                      ? <RiEyeOffLine aria-hidden className="size-4" />
                      : <RiEyeLine aria-hidden className="size-4" />}
                  </InputGroupButton>
                </InputGroup>
                {fieldErrors.confirm && (
                  <FieldError id="rp-confirm-error">{fieldErrors.confirm}</FieldError>
                )}
              </FieldContent>
            </Field>
          </div>

          <Button
            type="submit"
            className="min-h-[44px] w-full touch-manipulation"
            disabled={isLoading || otp.length < OTP_LENGTH}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <><RiLoader4Line aria-hidden className="size-4 animate-spin" /> Updating password…</>
            ) : (
              "Set new password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
