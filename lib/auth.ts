import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendEmail } from "./email";
import * as schema from "./schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Password Aliran",
        html: `
          <p>Halo ${user.name ?? ""}!</p>
          <p>Kamu meminta reset password. Klik link di bawah untuk membuat password baru:</p>
          <p><a href="${url}" style="background:#2d6a4f;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a></p>
          <p style="color:#888;font-size:12px;">Link ini berlaku selama 1 jam. Abaikan email ini jika kamu tidak merasa meminta reset password.</p>
        `,
      });
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // update session every 1 day
  },
  rateLimit: {
    window: 60 * 15, // 15 minutes
    max: 5,
  },
});

export type Auth = typeof auth;
