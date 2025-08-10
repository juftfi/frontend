import { Currency, DEFAULT_TICK_SPACING, Pool, Route, Token } from "@cryptoalgebra/custom-pools-sdk";
import { useMemo } from "react";
import { useSwapPools } from "./useSwapPools";
import { useChainId } from "wagmi";
import { Address } from "viem";

/**
 * Returns true if poolA is equivalent to poolB
 * @param poolA one of the two pools
 * @param poolB the other pool
 */
function poolEquals(poolA: Pool, poolB: Pool): boolean {
    return poolA === poolB || (poolA.token0.equals(poolB.token0) && poolA.token1.equals(poolB.token1));
}

function computeAllRoutes(
    currencyIn: Currency,
    currencyOut: Currency,
    pools: {
        tokens: [Token, Token];
        pool: { address: Address; liquidity: string; price: string; tick: string; fee: string; deployer: string };
    }[],
    chainId: number,
    currentPath: Pool[] = [],
    allPaths: Route<Currency, Currency>[] = [],
    startCurrencyIn: Currency = currencyIn,
    maxHops = 2
): Route<Currency, Currency>[] {
    const tokenIn = currencyIn?.wrapped;
    const tokenOut = currencyOut?.wrapped;

    if (!tokenIn || !tokenOut) throw new Error("Missing tokenIn/tokenOut");

    for (const pool of pools) {
        try {
            const [tokenA, tokenB] = pool.tokens;

            const { liquidity, price, tick, fee, deployer } = pool.pool;

            const newPool = new Pool(tokenA, tokenB, +fee, price, deployer, liquidity, Number(tick), DEFAULT_TICK_SPACING);

            if (!newPool.involvesToken(tokenIn) || currentPath.find((pathPool) => poolEquals(newPool, pathPool))) continue;

            const outputToken = newPool.token0.equals(tokenIn) ? newPool.token1 : newPool.token0;
            if (outputToken.equals(tokenOut)) {
                allPaths.push(new Route([...currentPath, newPool], startCurrencyIn, currencyOut));
            } else if (maxHops > 1) {
                computeAllRoutes(
                    outputToken,
                    currencyOut,
                    pools,
                    chainId,
                    [...currentPath, newPool],
                    allPaths,
                    startCurrencyIn,
                    maxHops - 1
                );
            }
        } catch (e) {
            console.error(e);
            continue;
        }
    }

    return allPaths;
}

/**
 * Returns all the routes from an input currency to an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useAllRoutes(
    currencyIn?: Currency,
    currencyOut?: Currency,
    deployer?: Address
): { loading: boolean; routes: Route<Currency, Currency>[] } {
    const chainId = useChainId();

    const { pools, loading: poolsLoading } = useSwapPools(currencyIn, currencyOut, deployer);

    return useMemo(() => {
        if (poolsLoading || !chainId || !pools || !currencyIn || !currencyOut)
            return {
                loading: true,
                routes: [],
            };

        // Hack
        // const singleIfWrapped = (currencyIn.isNative || currencyOut.isNative)

        const routes = computeAllRoutes(currencyIn, currencyOut, pools, chainId, [], [], currencyIn, 1);

        return { loading: false, routes };
    }, [chainId, currencyIn, currencyOut, pools, poolsLoading]);
}
