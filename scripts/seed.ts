/**
 * Seed script — creates the default admin user.
 *
 * Run with:  pnpm seed
 *
 * Re-running is safe: the script checks for an existing email before inserting.
 */

import "dotenv/config";
import { db } from "../integrations/drizzle/db";
import { user, account } from "../integrations/drizzle/schema";
import { hashPassword } from "../lib/password";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

// ── Config ────────────────────────────────────────────────────────────────────

const ADMIN = {
  name: "Admin",
  email: "admin@agency.local",
  password: "Admin@1234!",
  role: "admin" as const,
};

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱  Seeding default admin user…");

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, ADMIN.email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`✅  Admin already exists (id: ${existing[0]!.id}). Skipping.`);
    process.exit(0);
  }

  const now = new Date();
  const userId = randomUUID();
  const hashedPw = await hashPassword(ADMIN.password);

  await db.insert(user).values({
    id: userId,
    name: ADMIN.name,
    email: ADMIN.email,
    emailVerified: true,
    role: ADMIN.role,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(account).values({
    id: randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPw,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`✅  Admin created:`);
  console.log(`    Email   : ${ADMIN.email}`);
  console.log(`    Password: ${ADMIN.password}`);
  console.log(`    Role    : ${ADMIN.role}`);
  console.log(`\n⚠️   Change the password after first login!`);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
