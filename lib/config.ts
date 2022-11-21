import { Chain } from "wagmi";

export const addresses = {
  depositManager: process.env.NEXT_PUBLIC_DEPOSIT_MANAGER!,
  depositBoxes: process.env.NEXT_PUBLIC_DEPOSIT_BOXES!,
  nft: process.env.NEXT_PUBLIC_FEE_NFT!,
};

export const bnbChain: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "binance",
  nativeCurrency: {
    decimals: 18,
    name: "Binance",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed1.binance.org/",
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
    etherscan: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
};

export const bnbTestChain: Chain = {
  id: 97,
  name: "BSC Testnet",
  network: "binance",
  nativeCurrency: {
    decimals: 18,
    name: "Binance",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s3.binance.org:8545/",
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://testnet.bscscan.com" },
    etherscan: { name: "BscScan", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
};

export const customChains = [bnbChain, bnbTestChain];
