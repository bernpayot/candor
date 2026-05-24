import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database.js";
import requireEnv from "./env.checker.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    requireEnv("CORS_ORIGIN"),
  ],
  user: {
    modelName: "user",
    additionalFields: {
      timezone: {
        type: "string",
        required: false,
        defaultValue: "UTC",
        input: true,
      },
    },
  },
  session: {
    modelName: "session",
  },
  account: {
    modelName: "account",
  },
  verification: {
    modelName: "verification",
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
