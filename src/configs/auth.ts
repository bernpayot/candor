import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./database.js";
import requireEnv from "./env.checker.js";
import { resend, RESEND_FROM_EMAIL } from "./resend.js";
import { buildVerificationOTPEmail } from "../utils/email.templates.js";

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
    enabled: false,
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      disableSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        const { subject, text, html } = buildVerificationOTPEmail({
          otp,
          type,
        });

        await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: email,
          subject,
          text,
          html,
        });
      },
    }),
  ],
});
