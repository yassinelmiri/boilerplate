import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  emailOTPClient,
  adminClient,
  lastLoginMethodClient,
  multiSessionClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { auditLogClient } from "better-auth-audit-logs/client";
import { ac } from "@/lib/permissions";
import { adminRole, memberRole } from "@/lib/roles";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, ""),
  plugins: [
    magicLinkClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        member: memberRole,
      },
    }),
    lastLoginMethodClient(),
    multiSessionClient(),
    auditLogClient(),
  ],
});

export type AuthClient = typeof authClient;
