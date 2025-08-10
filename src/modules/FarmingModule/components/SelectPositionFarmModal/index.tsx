import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Deposit } from "@/graphql/generated/graphql";
import { cn } from "@/utils/common/cn";
import { FormattedPosition } from "@/types/formatted-position";
import { useState } from "react";
import { Farming } from "../../../../types/farming-info";
import { useFarmCheckApprove } from "../../hooks/useFarmCheckApprove";
import { useFarmApprove } from "../../hooks/useFarmApprove";
import { useFarmStake } from "../../hooks/useFarmStake";
import { FarmingPositionCard } from "..";
import { Address } from "viem";

interface SelectPositionFarmModalProps {
    positions: Deposit[];
    farming: Farming;
    positionsData: FormattedPosition[];
    isHarvestLoading: boolean;
}

export function SelectPositionFarmModal({ positions, farming, positionsData, isHarvestLoading }: SelectPositionFarmModalProps) {
    const [selectedPosition, setSelectedPosition] = useState<Deposit | null>();
    const tokenId = selectedPosition ? BigInt(selectedPosition.id) : 0n;

    const { approved, isLoading: isApproving } = useFarmCheckApprove(tokenId);

    const { isLoading: isApproveLoading, onApprove } = useFarmApprove(tokenId);

    const { isLoading: isStakeLoading, onStake } = useFarmStake({
        tokenId,
        rewardToken: farming.farming.rewardToken as Address,
        bonusRewardToken: farming.farming.bonusRewardToken as Address,
        pool: farming.farming.pool as Address,
        nonce: BigInt(farming.farming.nonce),
    });

    const handleApprove = async () => {
        if (approved || !onApprove) return;
        onApprove();
    };

    const handleStake = async () => {
        if (!approved || !onStake) return;
        if (isStakeLoading || isApproveLoading) return;
        onStake();
    };

    const handleSelectPosition = (position: Deposit) => {
        if (isStakeLoading || isApproveLoading || isApproving) return;
        setSelectedPosition(position);
    };

    const availablePositions = positions.filter((position) => position.eternalFarming === null && BigInt(position.liquidity) > 0n);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={isHarvestLoading} className="whitespace-nowrap w-1/2">
                    Deposit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[500px] rounded-xl! bg-card">
                <DialogHeader>
                    <DialogTitle className="font-bold select-none my-2 max-md:mx-auto">Select Position</DialogTitle>
                </DialogHeader>
                <div className="py-1">
                    <ul className="grid grid-cols-2 max-md:grid-cols-1 max-h-[300px] gap-3 overflow-auto">
                        {availablePositions.length > 0 ? (
                            availablePositions.map((position) => {
                                const currentFormattedPosition = positionsData.find(
                                    (fposition) => Number(fposition.id) === Number(position.id)
                                );
                                if (!currentFormattedPosition) return;
                                return (
                                    <FarmingPositionCard
                                        key={position.id}
                                        className={cn(
                                            "w-full row-span-1 col-span-1",
                                            selectedPosition?.id === position.id ? "border-primary-button hover:border-primary-button" : ""
                                        )}
                                        onClick={() => handleSelectPosition(position)}
                                        position={position}
                                        status={currentFormattedPosition.outOfRange ? "Out of range" : "In range"}
                                    />
                                );
                            })
                        ) : (
                            <h3 className="mx-auto col-span-2">You don't have available positions for this pool</h3>
                        )}
                    </ul>
                </div>
                <div className="w-full flex gap-3 mt-2">
                    {isApproving ? (
                        <Button disabled className="w-full">
                            Checking Approval...
                        </Button>
                    ) : selectedPosition && availablePositions.length > 0 ? (
                        <>
                            <Button disabled={approved || isApproveLoading} className="w-1/2" onClick={handleApprove}>
                                {approved ? <span>1. Approved</span> : isApproveLoading ? <Loader /> : <span>1. Approve</span>}
                            </Button>
                            <Button disabled={!approved || isStakeLoading} className="w-1/2" onClick={handleStake}>
                                {isStakeLoading ? <Loader /> : "2. Deposit"}
                            </Button>
                        </>
                    ) : (
                        <Button disabled className="w-full">
                            Select Position
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
