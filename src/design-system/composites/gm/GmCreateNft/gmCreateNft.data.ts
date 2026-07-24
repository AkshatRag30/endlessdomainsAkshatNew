export interface NftChainOption {
  id: string
  label: string
  icon: string
}

export const NFT_CHAINS: NftChainOption[] = [
  { id: 'base',       label: 'Base',        icon: '/gm/create-nft/chains/base.png' },
  { id: 'ink',        label: 'Ink',         icon: '/gm/create-nft/chains/ink.png' },
  { id: 'unichain',   label: 'Unichain',    icon: '/gm/create-nft/chains/unichain.png' },
  { id: 'soneium',    label: 'Soneium',     icon: '/gm/create-nft/chains/soneium.png' },
  { id: 'eth',        label: 'ETH',         icon: '/gm/create-nft/chains/eth.png' },
  { id: 'bsc',        label: 'BSC',         icon: '/gm/create-nft/chains/bsc.png' },
  { id: 'abstract',   label: 'Abstract',    icon: '/gm/create-nft/chains/abstract.png' },
  { id: 'katana',     label: 'Katana',      icon: '/gm/create-nft/chains/katana.png' },
  { id: 'bob',        label: 'BOB',         icon: '/gm/create-nft/chains/bob.png' },
  { id: 'linea',      label: 'Linea',       icon: '/gm/create-nft/chains/linea.png' },
  { id: 'botanix',    label: 'Botanix',     icon: '/gm/create-nft/chains/botanix.png' },
  { id: 'shardeum',   label: 'Shardeum',    icon: '/gm/create-nft/chains/shardeum.png' },
  { id: 'plume',      label: 'Plume',       icon: '/gm/create-nft/chains/plume.png' },
  { id: 'tempo',      label: 'Tempo',       icon: '/gm/create-nft/chains/tempo.png' },
  { id: 'robinhood',  label: 'Robinhood',   icon: '/gm/create-nft/chains/robinhood.png' },
  { id: 'optimism',   label: 'Optimism',    icon: '/gm/create-nft/chains/optimism.png' },
  { id: 'worldchain', label: 'World Chain', icon: '/gm/create-nft/chains/worldchain.png' },
]

export const NFT_CATEGORIES = ['Art', 'Gaming', 'Music', 'Photography', 'Sports', 'Utility', 'Collectibles'] as const

export interface GmCreateNftFormState {
  collectionName: string
  symbol: string
  description: string
  imageFile: File | null
  chainId: string
  category: string
  externalLink: string
}

export const INITIAL_CREATE_NFT_FORM: GmCreateNftFormState = {
  collectionName: '',
  symbol: '',
  description: '',
  imageFile: null,
  chainId: 'base',
  category: '',
  externalLink: '',
}
