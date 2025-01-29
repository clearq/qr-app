import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { getUserById } from "./data/auth";
import { clearAuthCookies } from "@/actions/auth"; // Import the Server Action

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  pages: {
    signIn: "/login",
    error: "/404.tsx",
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, user }) {
      // Control of Google provider
      return true;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.email = existingUser.email;
      token.firstName = existingUser.firstName;
      token.picture = existingUser.image;
      token.roleId = existingUser.roleId;
      token.orgNumber = existingUser.orgNumber;

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.emailVerified = token.emailVerified;
      }

      return session;
    },
  },
  events: {
    async signOut(params) {
      // Check if the params contain a token
      if ("token" in params) {
        const { token } = params;

        // Call the Server Action to clear cookies
        await clearAuthCookies();
      }
      // Check if the params contain a session
      else if ("session" in params) {
        const { session } = params;

        // Handle session-based cleanup if needed
      } else {
      }
    },
  },
});
