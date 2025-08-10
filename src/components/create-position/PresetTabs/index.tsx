import { useMemo } from "react";
import { Currency, encodeSqrtRatioX96, Percent, TickMath, tickToPrice } from "@cryptoalgebra/custom-pools-sdk";
import { IDerivedMintInfo, useMintState, useMintActionHandlers } from "@/state/mintStore";
import { PresetProfits, Presets, PresetsArgs } from "@/types/presets";
import { Button } from "@/components/ui/button";

interface RangeSidebarProps {
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    mintInfo: IDerivedMintInfo;
}

const stablecoinsPreset = [
    {
        type: Presets.STABLE,
        title: `Stablecoins`,
        min: 98,
        max: 101,
        risk: PresetProfits.VERY_LOW,
        profit: PresetProfits.HIGH,
        logo: (
            <svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <rect x="46" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="56" y="0" width="8" height="40" rx="2" className="fill-accent-100" />
                <rect x="66" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <line x1="10" y1="42" x2="110" y2="42" className="stroke-text-200" strokeWidth="1" />
            </svg>
        ),
    },
];

const commonPresets = [
    {
        type: Presets.RISK,
        title: `Narrow`,
        min: 95,
        max: 110,
        risk: PresetProfits.HIGH,
        profit: PresetProfits.HIGH,
        logo: (
            <svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <rect x="46" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="56" y="0" width="8" height="40" rx="2" className="fill-accent-100" />
                <rect x="66" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <line x1="10" y1="42" x2="110" y2="42" className="stroke-text-200" strokeWidth="1" />
            </svg>
        ),
    },
    {
        type: Presets.NORMAL,
        title: `Common`,
        min: 90,
        max: 120,
        risk: PresetProfits.MEDIUM,
        profit: PresetProfits.MEDIUM,
        logo: (
            <svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <rect x="36" y="15" width="8" height="25" rx="2" className="fill-primary-200" />
                <rect x="46" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="56" y="0" width="8" height="40" rx="2" className="fill-accent-100" />
                <rect x="66" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="76" y="15" width="8" height="25" rx="2" className="fill-primary-200" />
                <line x1="10" y1="42" x2="110" y2="42" className="stroke-text-200" strokeWidth="1" />
            </svg>
        ),
    },
    {
        type: Presets.SAFE,
        title: `Wide`,
        min: 80,
        max: 140,
        risk: PresetProfits.LOW,
        profit: PresetProfits.LOW,
        logo: (
            <svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <rect x="26" y="20" width="8" height="20" rx="2" className="fill-primary-200" />
                <rect x="36" y="15" width="8" height="25" rx="2" className="fill-primary-200" />
                <rect x="46" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="56" y="0" width="8" height="40" rx="2" className="fill-accent-100" />
                <rect x="66" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="76" y="15" width="8" height="25" rx="2" className="fill-primary-200" />
                <rect x="86" y="20" width="8" height="20" rx="2" className="fill-primary-200" />
                <line x1="10" y1="42" x2="110" y2="42" className="stroke-text-200" strokeWidth="1" />
            </svg>
        ),
    },
    {
        type: Presets.FULL,
        title: `Full`,
        min: 0,
        max: Infinity,
        risk: PresetProfits.VERY_LOW,
        profit: PresetProfits.VERY_LOW,
        logo: (
            <svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <rect x="16" y="25" width="8" height="15" rx="2" className="fill-primary-200" />
                <rect x="26" y="20" width="8" height="20" rx="2" className="fill-primary-200" />
                <rect x="36" y="15" width="8" height="25" rx="2" className="fill-primary-200" />
                <rect x="46" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="56" y="0" width="8" height="40" rx="2" className="fill-accent-100" />
                <rect x="66" y="10" width="8" height="30" rx="2" className="fill-primary-200" />
                <rect x="76" y="15" width="8" height="25" rx="2" className="fill-primary-200" />
                <rect x="86" y="20" width="8" height="20" rx="2" className="fill-primary-200" />
                <rect x="96" y="25" width="8" height="15" rx="2" className="fill-primary-200" />
                <line x1="10" y1="42" x2="110" y2="42" className="stroke-text-200" strokeWidth="1" />
            </svg>
        ),
    },
];

const PresetTabs = ({ currencyA, currencyB, mintInfo }: RangeSidebarProps) => {
    const {
        preset,
        actions: { updateSelectedPreset, setFullRange },
    } = useMintState();

    const { onLeftRangeInput, onRightRangeInput } = useMintActionHandlers(mintInfo.noLiquidity);

    const isStablecoinPair = useMemo(() => {
        if (!currencyA || !currencyB) return false;

        // const stablecoins = [USDC.address, USDT.address, DAI.address];
        const stablecoins = ["", ""];

        return (
            stablecoins.includes(currencyA.wrapped.address.toLowerCase()) && stablecoins.includes(currencyB.wrapped.address.toLowerCase())
        );
    }, [currencyA, currencyB]);

    const price = useMemo(() => {
        if (!mintInfo.price) return;

        return mintInfo.invertPrice ? mintInfo.price.invert() : mintInfo.price;
    }, [mintInfo]);

    function handlePresetRangeSelection(preset: any | null) {
        if (!price) return;

        updateSelectedPreset(preset ? preset.type : null);

        if (preset && preset.type === Presets.FULL) {
            setFullRange();
        } else if (preset) {
            const minPrice = mintInfo.invertPrice
                ? price.invert().asFraction.multiply(new Percent(preset.min, 100))
                : price.asFraction.multiply(new Percent(preset.min, 100));
            const maxPrice = mintInfo.invertPrice
                ? price.invert().asFraction.multiply(new Percent(preset.max, 100))
                : price.asFraction.multiply(new Percent(preset.max, 100));

            const sqrtPriceMin = encodeSqrtRatioX96(minPrice.numerator, minPrice.denominator);
            const sqrtPriceMax = encodeSqrtRatioX96(maxPrice.numerator, maxPrice.denominator);

            const minPriceTick = TickMath.getTickAtSqrtRatio(sqrtPriceMin);
            const maxPriceTick = TickMath.getTickAtSqrtRatio(sqrtPriceMax);

            let priceAtMinTick;
            let priceAtMaxTick;

            if (currencyA && currencyB) {
                const baseToken = mintInfo.invertPrice ? currencyB.wrapped : currencyA.wrapped;
                const quoteToken = mintInfo.invertPrice ? currencyA.wrapped : currencyB.wrapped;

                priceAtMinTick = tickToPrice(baseToken, quoteToken, mintInfo.invertPrice ? maxPriceTick : minPriceTick);
                priceAtMaxTick = tickToPrice(baseToken, quoteToken, mintInfo.invertPrice ? minPriceTick : maxPriceTick);
            }

            if (priceAtMinTick && priceAtMaxTick) {
                onLeftRangeInput(mintInfo.invertPrice ? priceAtMinTick.invert().toSignificant() : priceAtMinTick.toSignificant());
                onRightRangeInput(mintInfo.invertPrice ? priceAtMaxTick.invert().toSignificant() : priceAtMaxTick.toSignificant());
            }
        } else {
            onLeftRangeInput("");
            onRightRangeInput("");
        }
    }

    const presets = isStablecoinPair ? stablecoinsPreset : commonPresets;

    function onPresetSelect(range: PresetsArgs) {
        if (preset == range.type) {
            handlePresetRangeSelection(null);
        } else {
            handlePresetRangeSelection(range);
        }
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 h-fit bg-card gap-3 rounded-xl p-1">
            {presets.map((range) => (
                <Button
                    variant={preset === range.type ? "iconHover" : "icon"}
                    size={"sm"}
                    key={`preset-range-${range.title}`}
                    onClick={() => onPresetSelect(range)}
                    className="flex-col h-24 gap-4 p-2 border"
                >
                    {range.title}
                    {range.logo}
                </Button>
            ))}
        </div>
    );
};

export default PresetTabs;
