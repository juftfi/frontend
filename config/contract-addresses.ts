import { ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";

export const ALGEBRA_FACTORY: Record<number, Address> = {
    [ChainId.Base]: "0x51a744E9FEdb15842c3080d0937C99A365C6c358",
    [ChainId.BaseSepolia]: "0x5E4F01767A1068C5570c29fDF9bf743b0Aa637d7",
};

export const QUOTER_V2: Record<number, Address> = {
    [ChainId.Base]: "0xe0e840C629402AB33433D00937Fe065634b1B1Af",
    [ChainId.BaseSepolia]: "0x4e73E421480a7E0C24fB3c11019254edE194f736",
};

export const SWAP_ROUTER: Record<number, Address> = {
    [ChainId.Base]: "0x5Cd40c7E21A15E7FC2503Fffd77cF70c60628F6C",
    [ChainId.BaseSepolia]: "0x4b2A38344b9aAc2F4e82130f35F1630C80ED94Bb",
};

export const NONFUNGIBLE_POSITION_MANAGER: Record<number, Address> = {
    [ChainId.Base]: "0x8aD26dc9f724c9A7319E0E25b907d15626D9a056",
    [ChainId.BaseSepolia]: "0x9ea4459c8DefBF561495d95414b9CF1E2242a3E2",
};

export const ALGEBRA_ETERNAL_FARMING: Record<number, Address> = {
    [ChainId.Base]: "0x652071AF348a44D38be519fA17eE9183A6e38F99",
    [ChainId.BaseSepolia]: "0xf3b57fE4d5D0927C3A5e549CB6aF1866687e2D62",
};

export const FARMING_CENTER: Record<number, Address> = {
    [ChainId.Base]: "0x3aA96eDb755C44F3E50C5408a36abb52f28326Ba",
    [ChainId.BaseSepolia]: "0x211BD8917d433B7cC1F4497AbA906554Ab6ee479",
};

export const LIMIT_ORDER_MANAGER: Record<number, Address> = {
    [ChainId.Base]: "0x211BD8917d433B7cC1F4497AbA906554Ab6ee479",
    [ChainId.BaseSepolia]: "0x822ddb9EECc3794790B8316585FebA5b8F7C7507",
};
