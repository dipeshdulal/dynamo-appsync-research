import NextAuth, { AuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt";
import CognitoAuthProvider from "next-auth/providers/cognito";

const congitoProvider = CognitoAuthProvider({
    clientId: process.env.COGNITO_CLIENT_ID ?? '',
    clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
    issuer: process.env.COGNITO_ISSUER ?? '',
    idToken: true,
})

const refreshAccessToken = async (token: JWT) => {
    const url = process.env.COGNITO_DOMAIN ?? '';
    const basicToken = `${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`
    const urlencoded = new URLSearchParams()
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("refresh_token", token.refreshToken);

    const resp = await fetch(`${url}/oauth2/token`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(basicToken).toString("base64")}`
        },
        body: urlencoded,
        redirect: "follow"
    })
    return {
        ...token,
        accessToken: (await resp.json()).access_token 
    }
}

export const authOptions: AuthOptions = {
    providers: [congitoProvider],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token ?? '';
                token.uid = profile?.sub;
            }
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            if (session) {
                session.accessToken = token.accessToken ?? '';
                session.refreshToken = token.refreshToken ?? '';
                session.user.uid = token.uid ?? '';
            }
            return session;
        }
    },
}

export default NextAuth(authOptions)