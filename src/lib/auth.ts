import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const isProduction = process.env.NODE_ENV === "production";

const authSecret =
  process.env.NEXTAUTH_SECRET ||
  (isProduction ? undefined : "dev-only-nextauth-secret-change-me");

type AdminAuthRow = {
  id: string;
  username: string;
  passwordHash: string;
};

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const rows = await prisma.$queryRaw<AdminAuthRow[]>`
          SELECT "id", "username", "passwordHash"
          FROM "AdminUser"
          WHERE "username" = ${username}
          LIMIT 1
        `;

        const user = rows[0];
        if (!user) {
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.name) {
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.name) {
        session.user.name = token.name;
      }

      return session;
    },
  },
};

export { authSecret };
