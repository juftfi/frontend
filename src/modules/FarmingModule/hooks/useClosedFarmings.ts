import { EternalFarming, SinglePoolQuery, useEternalFarmingsQuery } from "@/graphql/generated/graphql";
import { useClients } from "@/hooks/graphql/useClients";
import { useMemo, useState } from "react";
import { Address } from "viem";

export function useClosedFarmings({ poolId, poolInfo }: { poolId: Address; poolInfo: SinglePoolQuery | undefined }) {
    const [closedFarmings, setClosedFarmings] = useState<EternalFarming[] | null>();

    const { farmingClient } = useClients();

    const { data: initialData, loading: isLoading } = useEternalFarmingsQuery({
        variables: {
            pool: poolId,
        },
        client: farmingClient,
        skip: !poolInfo,
    });

    useMemo(() => {
        if (initialData && initialData.eternalFarmings) {
            const filteredFarmings = initialData.eternalFarmings.filter((farming) => farming.isDeactivated);
            setClosedFarmings(filteredFarmings);
        }
    }, [initialData]);

    return {
        closedFarmings,
        isLoading,
    };
}
