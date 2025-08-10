import { readNonfungiblePositionManagerOwnerOf, simulateNonfungiblePositionManagerCollect } from "@/generated";
import { wagmiConfig } from "@/providers/WagmiProvider";
import { CurrencyAmount, Pool, unwrappedToken } from "@cryptoalgebra/custom-pools-sdk";
import { maxUint128 } from "viem";

export async function getPositionFees(pool: Pool, positionId: number) {
    try {
        const owner = await readNonfungiblePositionManagerOwnerOf(wagmiConfig, {
            args: [BigInt(positionId)],
        });

        const {
            result: [fees0, fees1],
        } = await simulateNonfungiblePositionManagerCollect(wagmiConfig, {
            args: [
                {
                    tokenId: BigInt(positionId),
                    recipient: owner,
                    amount0Max: maxUint128,
                    amount1Max: maxUint128,
                },
            ],
            account: owner,
        });

        return [
            CurrencyAmount.fromRawAmount(unwrappedToken(pool.token0), fees0.toString()),
            CurrencyAmount.fromRawAmount(unwrappedToken(pool.token1), fees1.toString()),
        ];
    } catch (err) {
        console.error(err);
        return [undefined, undefined];
    }
}
