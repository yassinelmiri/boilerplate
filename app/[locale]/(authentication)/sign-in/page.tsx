import { setRequestLocale } from "next-intl/server";
import LoginForm from "@/components/auth/login-form";

type Props = { params: Promise<{ locale: string }> };

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginForm />;
}
