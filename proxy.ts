import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATHS = new Set([
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/magic-link",
  "/verify-email",
]);

function extractLocale(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  return match?.[1] ?? routing.defaultLocale;
}

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
}

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_PATHS.has(pathname) ||
    Array.from(PUBLIC_PATHS).some((p) => pathname.startsWith(p))
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = extractLocale(pathname);
  const normalizedPath = stripLocale(pathname);

  if (isPublicRoute(normalizedPath)) {
    return intlMiddleware(request);
  }

  if (!getSessionCookie(request)) {
    const loginUrl = new URL(`/${locale}/sign-in`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
