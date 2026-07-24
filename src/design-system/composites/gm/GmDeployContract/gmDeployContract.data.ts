export type DeployContractTemplateId = 'token' | 'multi-item'

export interface DeployContractTemplate {
  id: DeployContractTemplateId
  title: string
  description: string
  comingSoon?: boolean
}

export const DEPLOY_CONTRACT_TEMPLATES: DeployContractTemplate[] = [
  {
    id: 'token',
    title: 'A Token',
    description: 'Create your own currency that others can hold, send, and trade. Standard: ERC-20',
  },
  {
    id: 'multi-item',
    title: 'A Multi-Item Collection',
    description: 'Deploy a contract that can mint many different item types at once. Standard: ERC-1155',
    comingSoon: true,
  },
]

// ── Token configuration form (step 2) ───────────────────────────────────────────

export interface DeployTokenFormState {
  tokenName: string
  symbol: string
  totalSupply: string
  owner: string
  chainId: string
}

// design-specific: the connected wallet address populates `owner` once wallet
// integration is wired up — placeholder mirrors the Figma reference value
export const INITIAL_DEPLOY_TOKEN_FORM: DeployTokenFormState = {
  tokenName: '',
  symbol: '',
  totalSupply: '10000000000',
  owner: '0x723FE05c...30446DfEdD',
  chainId: 'base',
}
