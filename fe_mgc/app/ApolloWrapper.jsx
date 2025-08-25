"use client";
// ^ this file needs the "use client" pragma

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  });

  // use the `ApolloClient` from "@apollo/client-integration-nextjs"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/client-integration-nextjs"
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            coberturas: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            recursosHumanos: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    link: httpLink,
    // Configuración básica para desarrollo
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
