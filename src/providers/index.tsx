import ApolloProvider from "./ApolloProvider";
import RouterProvider from "./RouterProvider";
import WagmiProvider from "./WagmiProvider";

export default function Providers() {
    return (
        <ApolloProvider>
            <WagmiProvider>
                <RouterProvider />
            </WagmiProvider>
        </ApolloProvider>
    );
}
