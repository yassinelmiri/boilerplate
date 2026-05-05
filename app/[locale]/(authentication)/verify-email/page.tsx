import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import OtpVerifyForm from "@/components/auth/otp-verify-form";
import { Skeleton } from "@/components/ui/skeleton";

type Props = { params: Promise<{ locale: string }> };

export default async function VerifyEmailPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <OtpVerifyForm />
    </Suspense>
  );
}
