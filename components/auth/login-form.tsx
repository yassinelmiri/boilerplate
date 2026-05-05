"use client";

import {
  RiEyeLine,
  RiEyeOffLine,
  RiFingerprintLine,
  RiLoader4Line,
  RiLockLine,
  RiMagicLine,
  RiMailLine,
} from "@remixicon/react";
import { Link, useRouter } from "@/i18n/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";

function validateEmail(v: string) {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
}

function validatePassword(v: string) {
  if (!v) return "Password is required";
  if (v.length < 6) return "Password must be at least 6 characters";
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

export default function LoginForm({ className }: { className?: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string>();

  const handleSubmit = useCallback(async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr || passErr) {
      setFieldErrors({ email: emailErr, password: passErr });
      return;
    }

    setFieldErrors({});
    setGeneralError(undefined);
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe,
      callbackURL: "/dashboard",
    });

    setIsLoading(false);

    if (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        toast.info("Please verify your email first.");
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        return;
      }
      setGeneralError(
        error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "Invalid email or password."
          : error.code === "USER_BANNED"
            ? "Your account has been suspended. Please contact support."
            : error.code === "TOO_MANY_REQUESTS"
              ? "Too many attempts. Please try again later."
              : (error.message ?? "Something went wrong. Please try again."),
      );
      return;
    }

    router.push("/dashboard");
  }, [email, password, rememberMe, router]);

  const handlePasskey = useCallback(async () => {
    setIsPasskeyLoading(true);
    setGeneralError(undefined);

    const { error } = await authClient.signIn.passkey();

    setIsPasskeyLoading(false);

    if (error) {
      setGeneralError(error.message ?? "Passkey authentication failed.");
    }
  }, []);

  const emailError = fieldErrors.email;
  const passwordError = fieldErrors.password;

  return (
    <Card className={cn("w-full shadow-xs", className)}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {generalError && <ErrorAlert message={generalError} />}

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-[44px] w-full touch-manipulation"
              disabled={isPasskeyLoading}
              aria-busy={isPasskeyLoading}
              onClick={handlePasskey}
            >
              {isPasskeyLoading
                ? <RiLoader4Line aria-hidden className="size-4 animate-spin" />
                : <RiFingerprintLine aria-hidden className="size-4" />}
              Continue with Passkey
            </Button>

            <Button
              type="button"
              variant="outline"
              className="min-h-[44px] w-full touch-manipulation"
              asChild
            >
              <Link href="/magic-link">
                <RiMagicLine aria-hidden className="size-4" />
                Continue with Magic Link
              </Link>
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2 text-muted-foreground text-xs">
                Or continue with email
              </span>
            </div>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          >
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="login-email">
                Email <span aria-label="required" className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <InputGroup aria-invalid={!!emailError}>
                  <InputGroupAddon>
                    <RiMailLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com…"
                    required
                    value={email}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "login-email-error" : undefined}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email)
                        setFieldErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                  />
                </InputGroup>
                {emailError && <FieldError id="login-email-error">{emailError}</FieldError>}
              </FieldContent>
            </Field>

            <Field data-invalid={!!passwordError}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="login-password">
                  Password <span aria-label="required" className="text-destructive">*</span>
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FieldContent>
                <InputGroup aria-invalid={!!passwordError}>
                  <InputGroupAddon>
                    <RiLockLine aria-hidden className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password…"
                    required
                    value={password}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "login-password-error" : undefined}
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
                {passwordError && <FieldError id="login-password-error">{passwordError}</FieldError>}
              </FieldContent>
            </Field>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
              />
              <label
                htmlFor="remember-me"
                className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
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
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
