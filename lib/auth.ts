import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/mail";

import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";
import { VerificationEmail } from "@/emails/VerificationEmail";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignInAfterVerification: true,
    sendResetPassword: async ({ url, user }) => {
      const email = ResetPasswordEmail({ name: user.name, url });
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        content: email,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const email = VerificationEmail({ name: user.name, url });
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email Address",
        content: email,
      });
    },
  },

  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
