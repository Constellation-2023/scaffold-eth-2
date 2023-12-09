import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Wallet } from "@prisma/client";
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "~~/config/database";
import ENV from "~~/config/enviroment";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      wallets?: Wallet[];
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
  interface JWT extends DefaultJWT {
    wallets?: Wallet[];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", //specify jwt as by default with adapter its set to database
  },

  callbacks: {
    jwt: async ({ token }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: token?.sub,
        },
        select: {
          wallets: true,
        },
      });
      token.wallets = user?.wallets;

      return token;
    },

    session: async ({ session, token }) => {
      if (token) {
        const dbUser = await prisma.user.findFirst({
          where: {
            id: token?.sub,
          },
          select: {
            wallets: true,

            id: true,
          },
        });
        const wallets = dbUser?.wallets;
        // Set the user ID in the session
        session = {
          ...session,
          user: {
            ...session.user,
            id: dbUser?.id as unknown as string,
            wallets,
          },
        };
      }

      return session;
    },
  },
  secret: ENV.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/dashboard",
  },
};
export default NextAuth(authOptions);
