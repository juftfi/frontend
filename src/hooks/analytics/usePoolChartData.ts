import { usePoolDayDatasQuery, usePoolHourDatasQuery } from "@/graphql/generated/graphql";
import { useClients } from "@/hooks/graphql/useClients";
import { CHART_SPAN, ChartSpanType, POOL_CHART_TYPE, PoolChartTypeType } from "@/types/swap-chart";
import { UNIX_TIMESTAMPS, isDefined } from "@/utils";
import { USE_UNISWAP_PLACEHOLDER_DATA } from "config/graphql-urls";
import { UTCTimestamp } from "lightweight-charts";
import { useMemo } from "react";
import { uniswapPlaceholderPools } from "./uniswap/uniswap-addresses";

const now = Math.floor(Date.now() / 1000);

const values = {
    [POOL_CHART_TYPE.TVL]: "tvlUSD",
    [POOL_CHART_TYPE.VOLUME]: "volumeUSD",
    [POOL_CHART_TYPE.FEES]: "feesUSD",
    [POOL_CHART_TYPE.PRICE]: "token1Price",
} as const;

export function usePoolChartData(poolId: string | undefined, span: ChartSpanType, chartType: PoolChartTypeType, isSorted = true) {
    const { infoClient, uniswapInfoClient } = useClients();

    const { data: poolIndexerDayDatas, loading: poolIndexerDayDatasLoading } = usePoolDayDatasQuery({
        variables: {
            poolId: USE_UNISWAP_PLACEHOLDER_DATA ? uniswapPlaceholderPools[poolId?.toLowerCase() || ""] : poolId?.toLowerCase() || "",
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY] * (span === CHART_SPAN.DAY ? 2 : 1),
            to: now,
        },
        client: USE_UNISWAP_PLACEHOLDER_DATA ? uniswapInfoClient : infoClient,
        skip: !poolId,
    });

    const { data: poolIndexerHourDatas, loading: poolIndexerHourDatasLoading } = usePoolHourDatasQuery({
        variables: {
            poolId: USE_UNISWAP_PLACEHOLDER_DATA ? uniswapPlaceholderPools[poolId?.toLowerCase() || ""] : poolId?.toLowerCase() || "",
            from: now - UNIX_TIMESTAMPS[span] - UNIX_TIMESTAMPS[CHART_SPAN.DAY],
            to: now,
        },
        client: USE_UNISWAP_PLACEHOLDER_DATA ? uniswapInfoClient : infoClient,
        skip: !poolId || span === CHART_SPAN.MONTH || span === CHART_SPAN.THREE_MONTH || span === CHART_SPAN.YEAR,
    });

    const poolHourDatas = useMemo(() => {
        if (!poolIndexerHourDatas) return null;
        return poolIndexerHourDatas.poolHourDatas.map((d) => ({
            ...d,
            date: d.periodStartUnix,
        }));
    }, [poolIndexerHourDatas]);

    const poolDayDatas = useMemo(() => {
        if (!poolIndexerDayDatas) return [];
        return poolIndexerDayDatas.poolDayDatas;
    }, [poolIndexerDayDatas]);

    const chartData = useMemo(() => {
        const poolDatas = span === CHART_SPAN.DAY ? poolHourDatas : span === CHART_SPAN.WEEK ? poolHourDatas : poolDayDatas;

        if (!poolDatas?.[0]) return [];

        const value = values[chartType];

        const sortedValue =
            chartType === POOL_CHART_TYPE.PRICE && isSorted
                ? "token1Price"
                : chartType === POOL_CHART_TYPE.PRICE && !isSorted
                  ? "token0Price"
                  : value;

        const formattedData = poolDatas.filter(isDefined).map((v) => {
            return {
                time: v?.date as UTCTimestamp,
                value: Number(v[sortedValue]),
            };
        });

        return formattedData.slice(1);
    }, [span, poolHourDatas, poolDayDatas, chartType, isSorted]);

    return {
        chartData: chartData,
        poolDayDatas,
        poolHourDatas,
        loading: poolIndexerDayDatasLoading || poolIndexerHourDatasLoading,
    };
}
