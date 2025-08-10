import { useNativePriceQuery, usePoolFeeDataQuery, useSinglePoolQuery } from "@/graphql/generated/graphql";
import { Position } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";
import { useClients } from "../graphql/useClients";
import { useReadAlgebraPoolLiquidity } from "@/generated";

export function usePositionAPR(poolId: Address | undefined, position: Position | undefined, positionId?: string | undefined) {
    const { infoClient } = useClients();

    const { data: liquidity } = useReadAlgebraPoolLiquidity({
        address: poolId,
    });

    const { data: pool } = useSinglePoolQuery({
        variables: {
            poolId: poolId as string,
        },
        client: infoClient,
    });

    const { data: poolFeeData } = usePoolFeeDataQuery({
        variables: {
            poolId,
        },
        client: infoClient,
    });

    const { data: bundles } = useNativePriceQuery({ client: infoClient });

    const nativePrice = bundles?.bundles[0] && Number(bundles.bundles[0].maticPriceUSD);

    // Today fees
    const poolDayFees = poolFeeData && Boolean(poolFeeData.poolDayDatas.length) && Number(poolFeeData.poolDayDatas[0].feesUSD);

    // Avg fees
    // const poolDayFees = poolFeeData && Boolean(poolFeeData.poolDayDatas.length) && poolFeeData.poolDayDatas.reduce((acc, v) => acc + Number(v.feesUSD), 0) / poolFeeData.poolDayDatas.length

    const yearFee = poolDayFees && poolDayFees * 365;

    const liquidityRelation =
        position &&
        liquidity &&
        Number(position.liquidity.toString()) / (Number(liquidity) + (positionId ? 0 : Number(position.liquidity.toString())));

    const [amount0, amount1] = position ? [position.amount0.toSignificant(), position.amount1.toSignificant()] : [0, 0];

    const tvl =
        pool?.pool &&
        nativePrice &&
        Number(pool.pool.token0.derivedMatic) * nativePrice * Number(amount0) +
            Number(pool.pool.token1.derivedMatic) * nativePrice * Number(amount1);

    return liquidityRelation && yearFee && tvl && ((yearFee * liquidityRelation) / tvl) * 100;
}
