import { useMemo } from "react";
import { useToken } from "wagmi";
import { Token } from "@cryptoalgebra/custom-pools-sdk";
import { ExtendedNative } from "@cryptoalgebra/custom-pools-sdk";
import { ADDRESS_ZERO } from "@cryptoalgebra/custom-pools-sdk";
import { DEFAULT_NATIVE_NAME, DEFAULT_NATIVE_SYMBOL } from "config";
import { Address } from "viem";

export function useAlgebraToken(address: Address | undefined, chainId: number) {
    const isETH = address === ADDRESS_ZERO;

    const { data: tokenData, isLoading } = useToken({
        address: isETH ? undefined : address,
        chainId,
    });

    return useMemo(() => {
        if (!address) return;

        if (address === ADDRESS_ZERO) return ExtendedNative.onChain(chainId, DEFAULT_NATIVE_SYMBOL, DEFAULT_NATIVE_NAME);

        if (isLoading || !tokenData) return undefined;

        const { symbol, name, decimals } = tokenData;

        return new Token(chainId, address, decimals, symbol, name);
    }, [address, tokenData, isLoading, chainId]);
}
