"use client";

import {
  RiEyeLine,
  RiEyeOffLine,
  RiLoader4Line,
  RiLockLine,
  RiMailLine,
  RiUserLine,
} from "@remixicon/react";
import { Link, useRouter } from "@/i18n/navigation";
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
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

function validateName(v: string) {
  if (!v.trim()) return "Name is required";
}

function validateEmail(v: string) {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
}

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

export default function SignUpForm({ className }: { className?: string }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string>();

  const handleSubmit = useCallback(async () => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (nameErr || emailErr || passErr) {
      setFieldErrors({ name: nameErr, email: emailErr, password: passErr });
      return;
    }

    setFieldErrors({});
    setGeneralError(undefined);
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      callbackURL: "/dashboard",
    });

    setIsLoading(false);

    if (error) {
      setGeneralError(
        error.code === "USER_ALREADY_EXISTS"
          ? "An account with this email already exists."
          : error.code === "PASSWORD_TOO_SHORT"
            ? "Password is too short."
            : error.code === "PASSWORD_COMPROMISED"
              ? "This password has appeared in known data breaches. Please choose a different one."
              : (error.message ?? "Something went wrong. Please try again."),
      );
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
  }, [name, email, password, router]);

  return (
    <Card className={cn("w-full shadow-xs", className)}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Get started — it only takes a minute</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          {generalError && <ErrorAlert message={generalError} />}

          <div className="flex flex-col gap-4">
            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel htmlFor="signup-name">
                Full name <span aria-label="required" className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <InputGroup aria-invalid={!!fieldErrors.name}>
                  <InputGroupAddon>
                    <RiUserLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    required
                    value={name}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "signup-name-error" : undefined}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name)
                        setFieldErrors((p) => ({ ...p, name: validateName(e.target.value) }));
                    }}
                  />
                </InputGroup>
                {fieldErrors.name && (
                  <FieldError id="signup-name-error">{fieldErrors.name}</FieldError>
                )}
              </FieldContent>
            </Field>

            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="signup-email">
                Email <span aria-label="required" className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <InputGroup aria-invalid={!!fieldErrors.email}>
                  <InputGroupAddon>
                    <RiMailLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com…"
                    required
                    value={email}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email)
                        setFieldErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                  />
                </InputGroup>
                {fieldErrors.email && (
                  <FieldError id="signup-email-error">{fieldErrors.email}</FieldError>
                )}
              </FieldContent>
            </Field>

            <Field data-invalid={!!fieldErrors.password}>
              <FieldLabel htmlFor="signup-password">
                Password <span aria-label="required" className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <InputGroup aria-invalid={!!fieldErrors.password}>
                  <InputGroupAddon>
                    <RiLockLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters…"
                    required
                    value={password}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
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
                  <FieldError id="signup-password-error">{fieldErrors.password}</FieldError>
                )}
              </FieldContent>
            </Field>
          </div>

          <Button
            type="submit"
            className="min-h-[44px] w-full touch-manipulation"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <RiLoader4Line aria-hidden className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
