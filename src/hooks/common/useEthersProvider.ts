import { wagmiConfig } from "@/providers/WagmiProvider";
import { providers } from "ethers";
import { useMemo } from "react";
import useSWR from "swr";
import type { Account, Chain, Client, Transport } from "viem";
import { useChainId, useConnectorClient, usePublicClient } from "wagmi";

export function clientToJsonRpcProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    if (transport.type === "fallback")
        return new providers.FallbackProvider(
            (transport.transports as ReturnType<Transport>[]).map(({ value }) => new providers.JsonRpcProvider(value?.url, network))
        ) as unknown as providers.JsonRpcProvider;
    return new providers.JsonRpcProvider(transport.url, network);
}

export function clientToWeb3Provider(client: Client<Transport, Chain, Account>) {
    const { chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    return provider;
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider() {
    const chainId = useChainId();
    const client = usePublicClient({ chainId });

    return useMemo(() => {
        if (!client) throw new Error("No client");
        return clientToJsonRpcProvider(client);
    }, [client]);
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersSigner() {
    const chainId = useChainId();

    const { data: client } = useConnectorClient({
        config: wagmiConfig,
        chainId,
    });

    const { data: provider } = useSWR(client ? ["ethersProvider", client] : null, () => clientToWeb3Provider(client!));

    return provider;
}
