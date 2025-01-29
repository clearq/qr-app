import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  firstName: string;
  lastName: string;
  id: string;
  emailVerified: DateTime;
  roleId: string;
  language: string; // Add the `language` property
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    emailVerified: Date;
    language: string; // Add the `language` property to JWT
  }
}
