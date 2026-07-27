export interface SupportedChain {
  chain: string
  chainId: string
  name: string
  partnerId: string
  logo: string
  contractAddress: string | null
  gasEstimateGwei: string | null
  estimatedGasUsd: string
  status: 'active' | 'unavailable'
  verificationType: 'onchain' | 'memo'
  note?: string
}

export interface SupportedChainsResponse {
  chains: SupportedChain[]
}

// TODO(senior-dev): move behind the shared API client once it lands on this branch.
export const SUPPORTED_CHAINS_ENDPOINT = 'https://api.endlessdomains.io/api/v1/gm/supported-chains'
