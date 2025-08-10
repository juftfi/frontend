import { ContractConfig } from "@wagmi/cli";
import { AppKitNetwork } from "@reown/appkit/networks";
import {
    algebraBasePluginV1ABI,
    algebraCustomPoolEntryPointABI,
    algebraEternalFarmingABI,
    algebraFactoryABI,
    algebraPoolABI,
    farmingCenterABI,
    limitOrderManagerABI,
    nonfungiblePositionManagerABI,
    quoterV2ABI,
    swapRouterABI,
    wNativeABI,
} from "./abis";
import {
    ALGEBRA_ETERNAL_FARMING,
    ALGEBRA_FACTORY,
    FARMING_CENTER,
    LIMIT_ORDER_MANAGER,
    NONFUNGIBLE_POSITION_MANAGER,
    QUOTER_V2,
    SWAP_ROUTER,
} from "./contract-addresses";
import { defineChain } from "viem";

const baseChain = defineChain({
    id: 8453,
    network: "base",
    name: "Base",
    nativeCurrency: { name: "Base Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://base.gateway.tenderly.co/4q52tUempJuHciTWl5m1Ef"],
        },
        public: {
            http: ["https://base.gateway.tenderly.co/4q52tUempJuHciTWl5m1Ef"],
        },
    },
    blockExplorers: {
        etherscan: {
            name: "BaseScan",
            url: "https://basescan.org",
        },
        default: {
            name: "BaseScan",
            url: "https://basescan.org",
        },
    },
    contracts: {
        multicall3: {
            address: "0xfe3becd788320465ab649015f34f7771220a88b2",
            blockCreated: 24170245,
        },
    },
});

const baseSepoliaChain = /*#__PURE__*/ defineChain({
    id: 84532,
    network: "baseSepolia",
    name: "Base Sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["https://base-sepolia-rpc.publicnode.com"],
        },
        public: {
            http: ["https://base-sepolia-rpc.publicnode.com"],
        },
    },
    blockExplorers: {
        default: {
            name: "Basescan",
            url: "https://sepolia.basescan.org",
        },
        etherscan: {
            name: "Basescan",
            url: "https://sepolia.basescan.org",
        },
    },
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11",
            blockCreated: 1059647,
        },
    },
});

/* configure supported networks here */
export const wagmiNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [baseChain, baseSepoliaChain];

const rawContracts = [
    { name: "AlgebraFactory", abi: algebraFactoryABI },
    { name: "AlgebraPool", abi: algebraPoolABI },
    { name: "AlgebraBasePluginV1", abi: algebraBasePluginV1ABI },
    { name: "NonfungiblePositionManager", abi: nonfungiblePositionManagerABI },
    { name: "QuoterV2", abi: quoterV2ABI },
    { name: "SwapRouter", abi: swapRouterABI },
    { name: "AlgebraEternalFarming", abi: algebraEternalFarmingABI },
    { name: "FarmingCenter", abi: farmingCenterABI },
    { name: "LimitOrderManager", abi: limitOrderManagerABI },
    { name: "AlgebraCustomPoolEntryPoint", abi: algebraCustomPoolEntryPointABI },
    { name: "WrappedNative", abi: wNativeABI },
];

const contractAddreses = {
    AlgebraFactory: ALGEBRA_FACTORY,
    NonfungiblePositionManager: NONFUNGIBLE_POSITION_MANAGER,
    QuoterV2: QUOTER_V2,
    SwapRouter: SWAP_ROUTER,
    AlgebraEternalFarming: ALGEBRA_ETERNAL_FARMING,
    FarmingCenter: FARMING_CENTER,
    LimitOrderManager: LIMIT_ORDER_MANAGER,
};

export const wagmiContracts: ContractConfig[] = rawContracts.map((contract) => ({
    name: contract.name,
    abi: contract.abi,
    address: contractAddreses[contract.name as keyof typeof contractAddreses],
}));
