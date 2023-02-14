import NextAuth, { AuthOptions } from "next-auth"
import CognitoAuthProvider from "next-auth/providers/cognito";

export const authOptions: AuthOptions = {
    providers: [
        CognitoAuthProvider({
            clientId: process.env.COGNITO_CLIENT_ID ?? '',
            clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
            issuer: process.env.COGNITO_ISSUER ?? '',
            idToken: true,
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.uid = profile?.sub;
            }
            return token;
        },
        async session({ session, token }) {
            if (session) {
                session.accessToken = token.accessToken;
                session.user.uid = token.id;
            }
            return session;
        }
    }
}

export default NextAuth(authOptions)