import { createAccessControl } from "better-auth/plugins/access";
import type { AccessControl } from "better-auth/plugins/access";

export const statement = {
  user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
  session: ["list", "revoke", "delete"],
  apiKey: ["create", "read", "update", "delete"],
} as const;

export const roleBuilder = createAccessControl(statement);

export const ac: AccessControl = roleBuilder as unknown as AccessControl;
