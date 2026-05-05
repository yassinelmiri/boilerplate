import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  magicLink,
  emailOTP,
  admin,
  haveIBeenPwned,
  lastLoginMethod,
  multiSession,
} from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { auditLog } from "better-auth-audit-logs";
import { emailHarmony } from "better-auth-harmony";
import { db } from "@/integrations/drizzle/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { ac } from "@/lib/permissions";
import { adminRole, memberRole } from "@/lib/roles";
import {
  sendMagicLink,
  sendEmailOtp,
  sendChangeEmailConfirmation,
  sendDeleteAccountVerification,
} from "@/lib/mailer";

const isProd = process.env.NODE_ENV === "production";

function getOrigin(): string {
  const raw = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

function getRpID(): string {
  try {
    return new URL(getOrigin()).hostname;
  } catch {
    return "localhost";
  }
}

export const auth = betterAuth({
  // ── Identity ─────────────────────────────────────────────────────────────
  appName: process.env.APP_NAME ?? "Tacaric",
  baseURL: process.env.BETTER_AUTH_URL?.replace(/\/$/, ""),
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Telemetry ─────────────────────────────────────────────────────────────
  telemetry: {
    enabled: false,
  },

  // ── Database ──────────────────────────────────────────────────────────────
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  // ── Trusted Origins ───────────────────────────────────────────────────────
  trustedOrigins: [
    getOrigin(),
    ...(process.env.TRUSTED_ORIGINS?.split(",").map((o) => o.trim()) ?? []),
  ],

  // ── Email & Password ──────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: hashPassword,
      verify: ({ password, hash }) => verifyPassword(password, hash),
    },
  },

  // ── Email Verification ────────────────────────────────────────────────────
  // emailOTP with overrideDefaultEmailVerification:true owns this flow.
  emailVerification: {
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
  },

  // ── Session ───────────────────────────────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  // ── Account ───────────────────────────────────────────────────────────────
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "gitlab"],
    },
    encryptOAuthTokens: true,
    updateAccountOnSignIn: true,
  },

  // ── User ──────────────────────────────────────────────────────────────────
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendChangeEmailConfirmation(user.email, newEmail, url);
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerification(user.email, url);
      },
      beforeDelete: async (user) => {
        console.log(`[Delete Account] Removing data for user: ${user.id}`);
      },
    },
  },

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    storage: "database",
  },

  // ── Logger ────────────────────────────────────────────────────────────────
  logger: {
    disabled: false,
    level: isProd ? "error" : "debug",
  },

  // ── Advanced Security ─────────────────────────────────────────────────────
  advanced: {
    useSecureCookies: isProd,
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"],
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // ── Plugins ───────────────────────────────────────────────────────────────
  plugins: [
    // ── Email Harmony ──────────────────────────────────────────────────────
    emailHarmony({
      allowNormalizedSignin: true,
    }),

    // ── Magic Link ─────────────────────────────────────────────────────────
    magicLink({
      expiresIn: 600,
      allowedAttempts: 3,
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLink(email, url);
      },
    }),

    // ── Email OTP ──────────────────────────────────────────────────────────
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      resendStrategy: "rotate",
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmailOtp(email, otp, type);
      },
    }),

    // ── Passkey (WebAuthn) ─────────────────────────────────────────────────
    passkey({
      rpID: getRpID(),
      rpName: process.env.APP_NAME ?? "Tacaric",
      origin: getOrigin(),
    }),

    // ── Admin (dashboard: admin + member) ─────────────────────────────────
    admin({
      defaultRole: "member",
      adminRoles: ["admin"],
      ac,
      roles: {
        admin: adminRole,
        member: memberRole,
      },
      impersonationSessionDuration: 60 * 60,
      defaultBanReason: "Violation of terms of service",
      bannedUserMessage:
        "Your account has been suspended. Please contact support for assistance.",
    }),

    // ── Have I Been Pwned ──────────────────────────────────────────────────
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "This password has appeared in known data breaches. Please choose a more secure password.",
    }),

    // ── Last Login Method ──────────────────────────────────────────────────
    lastLoginMethod({
      storeInDatabase: true,
    }),

    // ── Multi-Session ──────────────────────────────────────────────────────
    multiSession({
      maximumSessions: 5,
    }),

    // ── Audit Log ─────────────────────────────────────────────────────────
    auditLog({
      nonBlocking: true,
      capture: {
        ipAddress: true,
        userAgent: true,
        requestBody: false,
      },
      piiRedaction: {
        enabled: true,
        strategy: "hash",
      },
      retention: {
        enabled: true,
        days: 90,
      },
      afterLog: async (entry) => {
        if (entry.severity === "critical" || entry.severity === "high") {
          console.log(
            `[Audit Alert] ${entry.severity.toUpperCase()} | Action: ${entry.action} | User: ${entry.userId ?? "unauthenticated"}`,
          );
        }
      },
    }),
  ],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
