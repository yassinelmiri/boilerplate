"use client";

import {
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiLoader4Line,
  RiMailLine,
} from "@remixicon/react";
import { Link } from "@/i18n/navigation";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/client";
import { cn } from "@/lib/utils";
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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

function validateEmail(v: string) {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
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

function SentState({ email }: { email: string }) {
  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>We&apos;ve sent a 6-digit reset code</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <RiCheckboxCircleLine aria-hidden className="size-6 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">
              Reset code sent to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              Check your inbox and enter the code on the next page.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" className="min-h-[44px] w-full touch-manipulation" asChild>
          <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
            Enter reset code →
          </Link>
        </Button>
        <Button type="button" variant="ghost" className="min-h-[44px] w-full touch-manipulation" asChild>
          <Link href="/sign-in">
            <RiArrowLeftLine aria-hidden className="size-4" />
            Back to sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ForgotPasswordForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [generalError, setGeneralError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }

    setEmailError(undefined);
    setGeneralError(undefined);
    setIsLoading(true);

    // emailOtp plugin owns this flow — sends a 6-digit OTP to the email
    const { error } = await authClient.emailOtp.requestPasswordReset({
      email: email.trim(),
    });

    setIsLoading(false);

    if (error) {
      setGeneralError(error.message ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }, [email]);

  if (sent) return <SentState email={email} />;

  return (
    <Card className={cn("w-full shadow-xs", className)}>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          {generalError && <ErrorAlert message={generalError} />}

          <Field data-invalid={!!emailError}>
            <FieldLabel htmlFor="fp-email">
              Email <span aria-label="required" className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <InputGroup aria-invalid={!!emailError}>
                <InputGroupAddon>
                  <RiMailLine aria-hidden className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="fp-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.com…"
                  required
                  value={email}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "fp-email-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validateEmail(e.target.value));
                  }}
                />
              </InputGroup>
              {emailError && <FieldError id="fp-email-error">{emailError}</FieldError>}
              <FieldDescription>
                We&apos;ll send a 6-digit code to this address
              </FieldDescription>
            </FieldContent>
          </Field>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="min-h-[44px] w-full touch-manipulation"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <><RiLoader4Line aria-hidden className="size-4 animate-spin" /> Sending code…</>
              ) : (
                "Send reset code"
              )}
            </Button>
            <Button type="button" variant="ghost" className="min-h-[44px] w-full touch-manipulation" asChild>
              <Link href="/sign-in">
                <RiArrowLeftLine aria-hidden className="size-4" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
