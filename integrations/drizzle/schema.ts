import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  bigint,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ─── Auth tables ──────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  normalizedEmail: text("normalized_email").unique(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  lastLoginMethod: text("last_login_method"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const passkey = pgTable(
  "passkey",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull(),
    counter: integer("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull(),
    transports: text("transports"),
    createdAt: timestamp("created_at"),
    aaguid: text("aaguid"),
  },
  (table) => [
    index("passkey_userId_idx").on(table.userId),
    index("passkey_credentialID_idx").on(table.credentialID),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    status: text("status").notNull(),
    severity: text("severity").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    index("auditLog_userId_idx").on(table.userId),
    index("auditLog_action_idx").on(table.action),
    index("auditLog_createdAt_idx").on(table.createdAt),
  ],
);

export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

// ─── Domain enums ─────────────────────────────────────────────────────────────

/**
 * IMM 5710 — Application to Change Conditions, Extend my Stay or Remain in Canada as a Worker
 * Add more IRCC form codes here as they are onboarded.
 */
export const questionnaireTypeEnum = pgEnum("questionnaire_type", [
  "imm5710", // Change Conditions / Extend Stay / Remain as Worker
  "imm5257", // Temporary Resident Visa
  "imm1294", // Study Permit
]);

export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "inactive",
  "archived",
]);

export const accessTypeEnum = pgEnum("access_type", [
  "form-fill", // client can read and write the questionnaire
  "read-only", // client can only review a submitted form
]);

// ─── Client ───────────────────────────────────────────────────────────────────

export const client = pgTable(
  "client",
  {
    id: text("id").primaryKey(),
    // The agency staff member (admin or member) who owns this client file.
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    status: clientStatusEnum("status").default("active").notNull(),
    notes: text("notes"),
    // Comma-separated tags, e.g. "worker,renewal,priority"
    tags: text("tags"),
    lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    archived: boolean("archived").default(false).notNull(),
  },
  (table) => [
    index("client_userId_idx").on(table.userId),
    index("client_email_idx").on(table.email),
    index("client_status_idx").on(table.status),
  ],
);

// ─── Questionnaire ────────────────────────────────────────────────────────────

export const questionnaire = pgTable(
  "questionnaire",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    type: questionnaireTypeEnum("type").notNull(),
    // Bump when the form schema changes so old submissions stay readable.
    version: integer("version").default(1).notNull(),
    // Full IRCC form fields stored as structured JSON.
    data: jsonb("data").default({}).notNull(),
    completed: boolean("completed").default(false).notNull(),
    // Locked questionnaires are read-only (submitted or under review).
    locked: boolean("locked").default(false).notNull(),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("questionnaire_clientId_idx").on(table.clientId),
    index("questionnaire_type_idx").on(table.type),
  ],
);

// ─── Client Access ────────────────────────────────────────────────────────────

/**
 * Tokenised access links sent to clients so they can fill or review their
 * questionnaire without needing an agency account.
 */
export const clientAccess = pgTable(
  "client_access",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    questionnaireId: text("questionnaire_id")
      .notNull()
      .references(() => questionnaire.id, { onDelete: "cascade" }),
    type: accessTypeEnum("type").default("form-fill").notNull(),
    // Opaque token included in the magic link sent to the client.
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    maxUses: integer("max_uses").default(1).notNull(),
    usedCount: integer("used_count").default(0).notNull(),
    revoked: boolean("revoked").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("clientAccess_clientId_idx").on(table.clientId),
    index("clientAccess_questionnaireId_idx").on(table.questionnaireId),
    index("clientAccess_token_idx").on(table.token),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  passkeys: many(passkey),
  auditLogs: many(auditLog),
  clients: many(client),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, { fields: [passkey.userId], references: [user.id] }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, { fields: [auditLog.userId], references: [user.id] }),
}));

export const clientRelations = relations(client, ({ one, many }) => ({
  owner: one(user, { fields: [client.userId], references: [user.id] }),
  questionnaires: many(questionnaire),
  accessTokens: many(clientAccess),
}));

export const questionnaireRelations = relations(questionnaire, ({ one, many }) => ({
  client: one(client, { fields: [questionnaire.clientId], references: [client.id] }),
  accessTokens: many(clientAccess),
}));

export const clientAccessRelations = relations(clientAccess, ({ one }) => ({
  client: one(client, { fields: [clientAccess.clientId], references: [client.id] }),
  questionnaire: one(questionnaire, {
    fields: [clientAccess.questionnaireId],
    references: [questionnaire.id],
  }),
}));

// ─── Schema export (used by drizzle-kit) ─────────────────────────────────────

export const schema = {
  user,
  session,
  account,
  verification,
  passkey,
  auditLog,
  rateLimit,
  client,
  questionnaire,
  clientAccess,
};
