import { usePool } from "@/hooks/pools/usePool";
import { usePosition, usePositionInFarming } from "@/hooks/positions/usePositions";
import { INITIAL_POOL_FEE } from "@cryptoalgebra/custom-pools-sdk";
import PositionNFT from "../PositionNFT";
import { FormattedPosition } from "@/types/formatted-position";
import { Skeleton } from "@/components/ui/skeleton";
import PositionRangeChart from "../PositionRangeChart";
import TokenRatio from "@/components/create-position/TokenRatio";
import { useDerivedMintInfo } from "@/state/mintStore";
import CollectFees from "../CollectFees";
import RemoveLiquidityModal from "@/components/modals/RemoveLiquidityModal";
import { EternalFarming } from "@/graphql/generated/graphql";
import { IncreaseLiquidityModal } from "@/components/modals/IncreaseLiquidityModal";
import { useCurrency } from "@/hooks/common/useCurrency";
import { formatAmount } from "@/utils/common/formatAmount";

import FarmingModule from "@/modules/FarmingModule";
import { Farming } from "@/types/farming-info";
import { createUncheckedPosition } from "@/utils/positions/createUncheckedPosition";
const { HarvestAndExitFarmingCard } = FarmingModule.components;

interface PositionCardProps {
    selectedPosition: FormattedPosition | undefined;
    farming?: Farming | null;
    closedFarmings?: EternalFarming[] | null;
}

const PositionCard = ({ selectedPosition, farming, closedFarmings }: PositionCardProps) => {
    const { loading, position } = usePosition(selectedPosition?.id);

    const positionInFarming = usePositionInFarming(selectedPosition?.id);

    const activeFarming = farming?.farming;
    const endedFarming = closedFarmings?.find((closedFarming) => closedFarming.id === positionInFarming?.eternalFarming);

    const token0 = position?.token0;
    const token1 = position?.token1;

    const currencyA = useCurrency(token0, true);
    const currencyB = useCurrency(token1, true);

    const [, pool] = usePool(position?.pool);
    const positionEntity =
        pool &&
        position &&
        createUncheckedPosition(pool, position.liquidity.toString(), Number(position.tickLower), Number(position.tickUpper));

    const mintInfo = useDerivedMintInfo(currencyA, currencyB, position?.pool, INITIAL_POOL_FEE, currencyA, positionEntity || undefined);

    const [positionLiquidityUSD, positionFeesUSD, positionAPR] = selectedPosition
        ? [
              `$${formatAmount(selectedPosition.liquidityUSD, 2)}`,
              `$${formatAmount(Number(selectedPosition.feesUSD), 2)}`,
              `${formatAmount(selectedPosition.apr, 2)}%`,
          ]
        : [];

    if (!selectedPosition || loading) return;

    return (
        <div className="flex flex-col gap-6 bg-card border border-card-border rounded-xl p-4 animate-fade-in">
            <div className="relative flex w-full justify-end text-right">
                <div className="absolute left-0 top-0">
                    <PositionNFT positionId={Number(selectedPosition.id)} />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <h2 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-2xl">{`Position #${selectedPosition?.id}`}</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="font-bold text-xs">LIQUIDITY</div>
                            <div className="font-semibold text-2xl">
                                {positionLiquidityUSD ? (
                                    <span className="text-cyan-300 drop-shadow-cyan">{positionLiquidityUSD}</span>
                                ) : (
                                    <Skeleton className="w-[100px] h-[30px]" />
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-xs">APR</div>
                            <div className="font-semibold text-2xl">
                                {positionAPR ? (
                                    <span className="text-fuchsia-400 drop-shadow-pink">{positionAPR}</span>
                                ) : (
                                    <Skeleton className="w-[100px] h-[30px]" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CollectFees positionFeesUSD={positionFeesUSD} mintInfo={mintInfo} positionId={Number(selectedPosition.id)} />
            <TokenRatio mintInfo={mintInfo} />

            {positionEntity && (
                <div className="flex justify-between font-semibold">
                    <div>{`${formatAmount(positionEntity.amount0.toSignificant(24), 6)} ${currencyA?.symbol}`}</div>
                    <div>{`${formatAmount(positionEntity.amount1.toSignificant(24), 6)} ${currencyB?.symbol}`}</div>
                </div>
            )}
            {pool && positionEntity && <PositionRangeChart pool={pool} position={positionEntity} />}

            {positionEntity && (
                <div className="flex gap-4 w-full whitespace-nowrap">
                    <IncreaseLiquidityModal
                        tokenId={Number(Number(selectedPosition.id))}
                        currencyA={currencyA}
                        currencyB={currencyB}
                        mintInfo={mintInfo}
                    />
                </div>
            )}
            {positionEntity && Number(positionEntity.liquidity) > 0 && (
                <div className="flex gap-4 w-full whitespace-nowrap">
                    <RemoveLiquidityModal positionId={Number(selectedPosition.id)} />
                </div>
            )}
            {positionInFarming && activeFarming && !endedFarming && (
                <HarvestAndExitFarmingCard eternalFarming={activeFarming} selectedPosition={positionInFarming} isEnded={false} />
            )}
            {positionInFarming && endedFarming && (
                <HarvestAndExitFarmingCard eternalFarming={endedFarming} selectedPosition={positionInFarming} isEnded />
            )}
        </div>
    );
};

export default PositionCard;
