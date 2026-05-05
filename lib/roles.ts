import { roleBuilder } from "@/lib/permissions";

/** Full dashboard control: manage users, sessions, and API keys. */
export const adminRole = roleBuilder.newRole({
  user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
  session: ["list", "revoke", "delete"],
  apiKey: ["create", "read", "update", "delete"],
});

/** Standard dashboard member: manage only their own API keys. */
export const memberRole = roleBuilder.newRole({
  apiKey: ["create", "read"],
});