type UniswapTokenAddress = string;
type IntegralTokenAddress = string;

type UniswapPoolAddress = string;
type IntegralPoolAddress = string;

export const uniswapPlaceholderTokens: Record<IntegralTokenAddress, UniswapTokenAddress> = {
    "0x4200000000000000000000000000000000000006": "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // ETH
    "0xabac6f23fdf1313fc2e9c9244f666157ccd32990": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // USDC
};

export const uniswapPlaceholderPools: Record<IntegralPoolAddress, UniswapPoolAddress> = {
    "0x6ac1effa0f55a64d3bfb77a47ff1da88c0f504d8": "0xa60a504d92a1c95bda729c3f745b361ca822d6dd", // ETH - USDC base
    "0x048822b49dffc1fedd4f1ddcd5525912bb2fac5f": "0xa60a504d92a1c95bda729c3f745b361ca822d6dd", // ETH - USDC all-inclusive
};
