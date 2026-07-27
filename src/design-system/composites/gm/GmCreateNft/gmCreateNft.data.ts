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
