import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Skeleton } from "@/components/ui/skeleton";

type Props = { params: Promise<{ locale: string }> };

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="h-72 w-full rounded-xl" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
