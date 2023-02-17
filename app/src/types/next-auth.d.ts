import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            uid: string
        } & DefaultSession["user"]
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        uid?: string;
    }
}