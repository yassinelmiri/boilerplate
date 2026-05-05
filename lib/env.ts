import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    APP_NAME: z.string().min(1),
    APP_VERSION: z.string().min(1),

    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_TELEMETRY: z.enum(["0", "1"]).default("0"),

    RESEND_API_KEY: z.preprocess((v) => v || undefined, z.string().min(1).optional()),
    RESEND_EMAIL_SENDER_NAME: z.preprocess((v) => v || undefined, z.string().min(1).optional()),
    RESEND_EMAIL_SENDER_ADDRESS: z.preprocess((v) => v || undefined, z.email().optional()),

    C15T_MODE: z.enum(["offline", "online"]).default("offline"),
    C15T_INSTANCE_URL: z.preprocess((v) => v || undefined, z.url().optional()),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_APP_LOCALE: z.string().min(1),
    NEXT_PUBLIC_APP_THEME: z.enum(["light", "dark"]).default("light"),
  },

  runtimeEnv: {
    APP_NAME: process.env.APP_NAME,
    APP_VERSION: process.env.APP_VERSION,

    DATABASE_URL: process.env.DATABASE_URL,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_TELEMETRY: process.env.BETTER_AUTH_TELEMETRY,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_SENDER_NAME: process.env.RESEND_EMAIL_SENDER_NAME,
    RESEND_EMAIL_SENDER_ADDRESS: process.env.RESEND_EMAIL_SENDER_ADDRESS,

    C15T_MODE: process.env.C15T_MODE,
    C15T_INSTANCE_URL: process.env.C15T_INSTANCE_URL,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_LOCALE: process.env.NEXT_PUBLIC_APP_LOCALE,
    NEXT_PUBLIC_APP_THEME: process.env.NEXT_PUBLIC_APP_THEME,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
