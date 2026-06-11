"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains";
import { http } from "wagmi";
import { PRIVY_APP_ID, WEB3_ENABLED } from "./web3-config";

// Euphoria-grade onboarding: email / social / passkey mint an embedded
// wallet on the spot; external wallets connect too. Base only.
const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
});

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  // No app id (e.g. fresh clone) → site runs exactly as before.
  if (!WEB3_ENABLED) return <>{children}</>;
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#34D399",
          logo: "https://sponsio.world/logo-mark.png",
        },
        loginMethods: ["email", "google", "apple", "passkey", "wallet"],
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        defaultChain: base,
        supportedChains: [base],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
