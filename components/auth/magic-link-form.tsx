"use client";

import {
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiLoader4Line,
  RiMagicLine,
  RiMailLine,
  RiRefreshLine,
  RiTimeLine,
} from "@remixicon/react";
import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";
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

const RESEND_COOLDOWN = 60;

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

function SentState({
  email,
  cooldown,
  isLoading,
  onResend,
}: {
  email: string;
  cooldown: number;
  isLoading: boolean;
  onResend: () => void;
}) {
  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>We&apos;ve sent you a magic link</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <RiCheckboxCircleLine aria-hidden className="size-8 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-sm">Magic link sent!</p>
            <p className="text-muted-foreground text-sm">
              Sent to <span className="font-medium">{email}</span>
            </p>
            <p className="text-muted-foreground text-xs">
              Click the link in the email to sign in. Check your spam folder if you
              don&apos;t see it.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="min-h-[44px] w-full touch-manipulation"
          disabled={cooldown > 0 || isLoading}
          aria-busy={isLoading}
          onClick={onResend}
        >
          {isLoading ? (
            <><RiLoader4Line aria-hidden className="size-4 animate-spin" /> Sending…</>
          ) : cooldown > 0 ? (
            <><RiTimeLine aria-hidden className="size-4" /> Resend in {cooldown}s</>
          ) : (
            <><RiRefreshLine aria-hidden className="size-4" /> Resend magic link</>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="min-h-[44px] w-full touch-manipulation"
          asChild
        >
          <Link href="/sign-in">
            <RiArrowLeftLine aria-hidden className="size-4" />
            Back to sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MagicLinkForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [generalError, setGeneralError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = useCallback(async (emailAddr: string) => {
    setIsLoading(true);
    setGeneralError(undefined);

    const { error } = await authClient.signIn.magicLink({
      email: emailAddr,
      callbackURL: "/dashboard",
    });

    setIsLoading(false);

    if (error) {
      setGeneralError(
        error.code === "TOO_MANY_REQUESTS"
          ? "Too many requests. Please wait before trying again."
          : (error.message ?? "Failed to send magic link. Please try again."),
      );
      return false;
    }

    return true;
  }, []);

  const handleSubmit = useCallback(async () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }

    setEmailError(undefined);
    const ok = await send(email.trim());
    if (ok) {
      setSent(true);
      setCooldown(RESEND_COOLDOWN);
    }
  }, [email, send]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    const ok = await send(email.trim());
    if (ok) setCooldown(RESEND_COOLDOWN);
  }, [cooldown, email, send]);

  if (sent) {
    return (
      <SentState
        email={email}
        cooldown={cooldown}
        isLoading={isLoading}
        onResend={handleResend}
      />
    );
  }

  return (
    <Card className={cn("w-full shadow-xs", className)}>
      <CardHeader>
        <CardTitle>Sign in with magic link</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a passwordless sign-in link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          {generalError && <ErrorAlert message={generalError} />}

          <Field data-invalid={!!emailError}>
            <FieldLabel htmlFor="magic-email">
              Email <span aria-label="required" className="text-destructive">*</span>
            </FieldLabel>
            <FieldContent>
              <InputGroup aria-invalid={!!emailError}>
                <InputGroupAddon>
                  <RiMailLine aria-hidden className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  id="magic-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.com…"
                  required
                  value={email}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "magic-email-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validateEmail(e.target.value));
                  }}
                />
              </InputGroup>
              {emailError && <FieldError id="magic-email-error">{emailError}</FieldError>}
              <FieldDescription>
                We&apos;ll send a secure one-click link — no password needed
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
                <><RiLoader4Line aria-hidden className="size-4 animate-spin" /> Sending magic link…</>
              ) : (
                <><RiMagicLine aria-hidden className="size-4" /> Send magic link</>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="min-h-[44px] w-full touch-manipulation"
              asChild
            >
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
