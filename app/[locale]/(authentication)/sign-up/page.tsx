import { setRequestLocale } from "next-intl/server";
import SignUpForm from "@/components/auth/sign-up-form";

type Props = { params: Promise<{ locale: string }> };

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SignUpForm />;
}
