import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource/raleway/400.css";
import "@fontsource/open-sans/700.css";

import type { AppProps } from "next/app";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import { bnbChain, bnbTestChain } from "../lib/config";
import theme from "../lib/theme";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.polygonMumbai, bnbChain, bnbTestChain],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Crypto Receipts",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
