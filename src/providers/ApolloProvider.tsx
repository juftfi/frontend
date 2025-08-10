import { infoClient } from "@/graphql/clients";
import { ApolloProvider as _ApolloProvider } from "@apollo/client";
import { DEFAULT_CHAIN_ID } from "config/default-chain";

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
    return <_ApolloProvider client={infoClient[DEFAULT_CHAIN_ID]}>{children}</_ApolloProvider>;
}
