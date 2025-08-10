import { Currency, CurrencyAmount } from "@cryptoalgebra/custom-pools-sdk";
import { Currency as CurrencyBN, CurrencyAmount as CurrencyAmountBN } from "@cryptoalgebra/router-custom-pools-and-sliding-fee";
import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

export function useNeedAllowance(
    currency: Currency | CurrencyBN | null | undefined,
    amount: CurrencyAmount<Currency> | CurrencyAmountBN<CurrencyBN> | undefined,
    spender: Address | undefined,
    fastPolling: boolean = false
) {
    const { address: account } = useAccount();

    const { data: allowance } = useReadContract({
        address: currency?.wrapped.address as Address,
        abi: erc20Abi,
        functionName: "allowance",
        args: account && spender ? [account, spender] : undefined,
        query: {
            refetchInterval: fastPolling ? 1000 : false,
        },
    });

    return Boolean(!currency?.isNative && typeof allowance === "bigint" && amount && amount.greaterThan(allowance.toString()));
}
