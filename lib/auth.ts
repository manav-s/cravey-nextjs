import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { NeonAdapter } from "@/lib/auth-adapter";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const authOptions: NextAuthOptions = {
  adapter: NeonAdapter(),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        if (!resend) {
          throw new Error("Missing RESEND_API_KEY for email sign-in");
        }

        await resend.emails.send({
          from: provider.from as string,
          to: identifier,
          subject: "Your Cravey sign-in link",
          html: `<p>Tap the secure magic link below to sign in:</p><p><a href="${url}">${url}</a></p>`,
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login?checkEmail=true",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const authHandler = NextAuth(authOptions);
