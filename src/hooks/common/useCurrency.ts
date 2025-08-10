import { useChainId } from "wagmi";
import { Currency, ExtendedNative, WNATIVE } from "@cryptoalgebra/custom-pools-sdk";
import { ADDRESS_ZERO } from "@cryptoalgebra/custom-pools-sdk";
import { DEFAULT_NATIVE_NAME, DEFAULT_NATIVE_SYMBOL } from "config";
import { useAlgebraToken } from "./useAlgebraToken";
import { Address } from "viem";

export function useCurrency(address: Address | undefined, asNative: boolean = true): Currency | ExtendedNative | undefined {
    const chainId = useChainId();
    const isWNative = address?.toLowerCase() === WNATIVE[chainId].address.toLowerCase();

    const isNative = address === ADDRESS_ZERO;

    const token = useAlgebraToken(isNative || isWNative ? ADDRESS_ZERO : address, chainId);

    const extendedEther = ExtendedNative.onChain(chainId, DEFAULT_NATIVE_SYMBOL, DEFAULT_NATIVE_NAME);

    if (asNative) return isNative || isWNative ? extendedEther : token;

    if (isWNative) return extendedEther.wrapped;

    return isNative ? extendedEther : token;
}
