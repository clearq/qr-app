import NextAuth, {type DefaultSession} from 'next-auth'




export type ExtendedUser = DefaultSession["user"] & {
    firstName : string;
    lastName : string;
    id : string;
    emailVerified : DateTime
}


declare module "next-auth" {
    // session
    interface Session {
        user : ExtendedUser
    }
}

declare module "next-auth/jwt" {
    // JWT
    interface JWT {
        emailVerified : DateTime
    }
}
