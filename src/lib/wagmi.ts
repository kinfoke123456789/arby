import { createConfig, http } from 'wagmi'
import { mainnet, arbitrum, polygon, optimism } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Get projectId from WalletConnect Cloud
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'

export const config = createConfig({
  chains: [mainnet, arbitrum, polygon, optimism],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}