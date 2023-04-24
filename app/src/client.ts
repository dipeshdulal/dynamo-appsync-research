import { split, HttpLink, ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { createClient, WebSocket } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { getSession } from "next-auth/react";

const url = "https://hhzxgyehs5gbboax7gby3nbp74.appsync-api.ap-south-1.amazonaws.com/graphql";

const httpLink = new HttpLink({ uri: url });
const link = ApolloLink.from([
    createSubscriptionHandshakeLink({
        region: 'ap-south-1',
        url: url,
        auth: {
            type: 'AMAZON_COGNITO_USER_POOLS',
            jwtToken: async () => {
                const session = await getSession();
                return session?.accessToken ?? ''
            },
        }
    }, httpLink)
])

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
