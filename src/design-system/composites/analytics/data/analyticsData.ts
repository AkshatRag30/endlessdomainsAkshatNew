// ── Types — mirror the exact shape of both analytics API responses ─────────────

export interface DomainMint {
  mintStatus: string
  domainProvider: string
}

export interface Domain {
  id: string
  createdDateTime: string
  isDeleted: boolean
  lastChangedDateTime: string
  domainId: string | null
  domainName: string
  domainProvider: string
  ownerAddress: string
  resolver: string
  resolution: string | null
  blockchain: string
  projectedBlockchain: string | null
  registryAddress: string
  token_id: string
  networkId: string | null
  node: string | null
  price: number
  userId: string
  domainMint: DomainMint[]
  expiryDate: string
  zone_uuid: string | null
}

export interface DomainSummary {
  createdDateTime: string
  domainName: string
  domainProvider: string
  ownerAddress: string
  registryAddress: string
  token_id: string
  expiryDate: string
}

export interface TLDGroup {
  tld: string
  count: number
  domains: Domain[]
}

export type RenewalType = 'Renewal' | 'Non-Renewal'

export interface RenewalGroup {
  type: RenewalType
  count: number
  domains: Domain[]
}

export interface PortfolioValueByChain {
  blockchain: string
  totalValue: number
}

export interface DomainCollection {
  total: number
  domains: DomainSummary[]
}

export interface DomainAnalyticsResult {
  totalDomains: number
  domainsByTLD: TLDGroup[]
  renewalStatus: RenewalGroup[]
  portfolioValueByChain: PortfolioValueByChain[]
  allDomains: DomainSummary[]
  uniqueTLDs: string[]
  uniqueProviders: string[]
  evmDomains: DomainCollection
  nonEvmDomains: DomainCollection
  listedDomains: DomainCollection
}

// ── Order history API types ────────────────────────────────────────────────────

export type OrderStatus = 'Completed' | 'Cancelled' | 'Pending'
export type MintStatus = 'Completed' | 'Failed' | 'Pending'

export interface OrderItem {
  id: string
  lastChangedDateTime: string
  orderNumber: string
  orderStatus: OrderStatus
  promoValue: number | null
  promoApplied: boolean
  domainName: string
  domainProvider: string
  mintStatus: MintStatus
  price: number
}

// ── Mock data constants ───────────────────────────────────────────────────────

const OWNER = '0xe572962a4C5335BccB787332F5b0b2CC7Af48A08'
const UD_REG = '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f'
const UDBASE_REG = '0xF6c1b83977DE3dEffC476f5048A0a84d3375d498'
const ENS_REG = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
const BSC_REG = '0xE3b1D332705143D70E8BEa8a2D56cE97A25A5615'
const USER_ID = '0d8f1574-7691-4d78-9161-96ae7059af69'

const makeDomain = (
  id: string,
  name: string,
  provider: string,
  registry: string,
  token: string,
  created: string,
  price: number,
  expiry = '',
): Domain => ({
  id,
  createdDateTime: created,
  isDeleted: false,
  lastChangedDateTime: created,
  domainId: null,
  domainName: name,
  domainProvider: provider,
  ownerAddress: OWNER,
  resolver: registry,
  resolution: null,
  blockchain: provider,
  projectedBlockchain: null,
  registryAddress: registry,
  token_id: token,
  networkId: null,
  node: null,
  price,
  userId: USER_ID,
  domainMint: [{ mintStatus: 'Completed', domainProvider: provider }],
  expiryDate: expiry,
  zone_uuid: null,
})

const makeSummary = (name: string, provider: string, registry: string, token: string, created: string, expiry = ''): DomainSummary => ({
  createdDateTime: created,
  domainName: name,
  domainProvider: provider,
  ownerAddress: OWNER,
  registryAddress: registry,
  token_id: token,
  expiryDate: expiry,
})

// ── Mock domain analytics result (13 domains, 4 providers, 5 TLDs) ────────────

export const mockDomainAnalytics: DomainAnalyticsResult = {
  totalDomains: 13,
  uniqueTLDs: ['og', 'brave', 'u', 'eth', 'bnb'],
  uniqueProviders: ['UD', 'UDBASE', 'ENS', 'BinanceSmartChain'],

  domainsByTLD: [
    {
      tld: 'og',
      count: 4,
      domains: [
        makeDomain('1', 'jackandjill.og', 'UD', UD_REG, '74733965951879018341', '2026-01-15T10:00:00.000Z', 12),
        makeDomain('2', 'creativecoder.og', 'UD', UD_REG, '40719772794823714503', '2026-01-20T10:00:00.000Z', 12),
        makeDomain('3', 'hellouniverse.og', 'UD', UD_REG, '99981234512345678901', '2026-02-05T10:00:00.000Z', 12),
        makeDomain('4', 'tpenguofficial.og', 'UD', UD_REG, '11112222333344445555', '2026-03-10T10:00:00.000Z', 2),
      ],
    },
    {
      tld: 'brave',
      count: 2,
      domains: [
        makeDomain('5', 'thecreativecoder.brave', 'UD', UD_REG, '60954573598178614330', '2026-01-25T10:00:00.000Z', 12),
        makeDomain('6', 'pixelwizard.brave', 'UD', UD_REG, '77889900112233445566', '2026-02-18T10:00:00.000Z', 12),
      ],
    },
    {
      tld: 'u',
      count: 3,
      domains: [
        makeDomain('7', 'strangerthings.u', 'UDBASE', UDBASE_REG, '13657432105134772497', '2025-11-10T10:00:00.000Z', 5),
        makeDomain('8', 'prisonerofazkaban.u', 'UDBASE', UDBASE_REG, '10999336943128023333', '2025-11-15T10:00:00.000Z', 5),
        makeDomain('9', 'believeit.u', 'UDBASE', UDBASE_REG, '55556666777788889999', '2026-01-05T10:00:00.000Z', 5),
      ],
    },
    {
      tld: 'eth',
      count: 2,
      domains: [
        makeDomain('10', 'darkforest.eth', 'ENS', ENS_REG, '22233344455566677788', '2025-10-20T10:00:00.000Z', 25, '2027-10-20T00:00:00.000Z'),
        makeDomain('11', 'cryptowave.eth', 'ENS', ENS_REG, '33344455566677788899', '2025-12-01T10:00:00.000Z', 20, '2027-12-01T00:00:00.000Z'),
      ],
    },
    {
      tld: 'bnb',
      count: 2,
      domains: [
        makeDomain('12', 'codemint.bnb', 'BinanceSmartChain', BSC_REG, '44455566677788899900', '2025-11-28T10:00:00.000Z', 5),
        makeDomain('13', 'defimaster.bnb', 'BinanceSmartChain', BSC_REG, '55566677788899900011', '2026-02-14T10:00:00.000Z', 5),
      ],
    },
  ],

  renewalStatus: [
    { type: 'Renewal', count: 2, domains: [] },
    { type: 'Non-Renewal', count: 11, domains: [] },
  ],

  portfolioValueByChain: [
    { blockchain: 'UD', totalValue: 62 },
    { blockchain: 'UDBASE', totalValue: 15 },
    { blockchain: 'ENS', totalValue: 45 },
    { blockchain: 'BinanceSmartChain', totalValue: 10 },
  ],

  allDomains: [
    makeSummary('jackandjill.og', 'UD', UD_REG, '74733965951879018341', '2026-01-15T10:00:00.000Z'),
    makeSummary('creativecoder.og', 'UD', UD_REG, '40719772794823714503', '2026-01-20T10:00:00.000Z'),
    makeSummary('hellouniverse.og', 'UD', UD_REG, '99981234512345678901', '2026-02-05T10:00:00.000Z'),
    makeSummary('tpenguofficial.og', 'UD', UD_REG, '11112222333344445555', '2026-03-10T10:00:00.000Z'),
    makeSummary('thecreativecoder.brave', 'UD', UD_REG, '60954573598178614330', '2026-01-25T10:00:00.000Z'),
    makeSummary('pixelwizard.brave', 'UD', UD_REG, '77889900112233445566', '2026-02-18T10:00:00.000Z'),
    makeSummary('strangerthings.u', 'UDBASE', UDBASE_REG, '13657432105134772497', '2025-11-10T10:00:00.000Z'),
    makeSummary('prisonerofazkaban.u', 'UDBASE', UDBASE_REG, '10999336943128023333', '2025-11-15T10:00:00.000Z'),
    makeSummary('believeit.u', 'UDBASE', UDBASE_REG, '55556666777788889999', '2026-01-05T10:00:00.000Z'),
    makeSummary('darkforest.eth', 'ENS', ENS_REG, '22233344455566677788', '2025-10-20T10:00:00.000Z', '2027-10-20T00:00:00.000Z'),
    makeSummary('cryptowave.eth', 'ENS', ENS_REG, '33344455566677788899', '2025-12-01T10:00:00.000Z', '2027-12-01T00:00:00.000Z'),
    makeSummary('codemint.bnb', 'BinanceSmartChain', BSC_REG, '44455566677788899900', '2025-11-28T10:00:00.000Z'),
    makeSummary('defimaster.bnb', 'BinanceSmartChain', BSC_REG, '55566677788899900011', '2026-02-14T10:00:00.000Z'),
  ],

  evmDomains: {
    total: 13,
    domains: [
      makeSummary('jackandjill.og', 'UD', UD_REG, '74733965951879018341', '2026-01-15T10:00:00.000Z'),
      makeSummary('creativecoder.og', 'UD', UD_REG, '40719772794823714503', '2026-01-20T10:00:00.000Z'),
      makeSummary('hellouniverse.og', 'UD', UD_REG, '99981234512345678901', '2026-02-05T10:00:00.000Z'),
      makeSummary('tpenguofficial.og', 'UD', UD_REG, '11112222333344445555', '2026-03-10T10:00:00.000Z'),
      makeSummary('thecreativecoder.brave', 'UD', UD_REG, '60954573598178614330', '2026-01-25T10:00:00.000Z'),
      makeSummary('pixelwizard.brave', 'UD', UD_REG, '77889900112233445566', '2026-02-18T10:00:00.000Z'),
      makeSummary('strangerthings.u', 'UDBASE', UDBASE_REG, '13657432105134772497', '2025-11-10T10:00:00.000Z'),
      makeSummary('prisonerofazkaban.u', 'UDBASE', UDBASE_REG, '10999336943128023333', '2025-11-15T10:00:00.000Z'),
      makeSummary('believeit.u', 'UDBASE', UDBASE_REG, '55556666777788889999', '2026-01-05T10:00:00.000Z'),
      makeSummary('darkforest.eth', 'ENS', ENS_REG, '22233344455566677788', '2025-10-20T10:00:00.000Z', '2027-10-20T00:00:00.000Z'),
      makeSummary('cryptowave.eth', 'ENS', ENS_REG, '33344455566677788899', '2025-12-01T10:00:00.000Z', '2027-12-01T00:00:00.000Z'),
      makeSummary('codemint.bnb', 'BinanceSmartChain', BSC_REG, '44455566677788899900', '2025-11-28T10:00:00.000Z'),
      makeSummary('defimaster.bnb', 'BinanceSmartChain', BSC_REG, '55566677788899900011', '2026-02-14T10:00:00.000Z'),
    ],
  },

  nonEvmDomains: { total: 0, domains: [] },

  listedDomains: {
    total: 3,
    domains: [
      makeSummary('jackandjill.og', 'UD', UD_REG, '74733965951879018341', '2026-01-15T10:00:00.000Z'),
      makeSummary('darkforest.eth', 'ENS', ENS_REG, '22233344455566677788', '2025-10-20T10:00:00.000Z', '2027-10-20T00:00:00.000Z'),
      makeSummary('codemint.bnb', 'BinanceSmartChain', BSC_REG, '44455566677788899900', '2025-11-28T10:00:00.000Z'),
    ],
  },
}

// ── Mock order history (10 orders from the piechartdata + extras) ─────────────

export const mockOrderHistory: OrderItem[] = [
  { id: '1', lastChangedDateTime: '2026-05-27T09:12:36.489Z', orderNumber: '1767162185293', orderStatus: 'Cancelled', promoValue: null, promoApplied: false, domainName: 'strangerthings.u', domainProvider: 'UD', mintStatus: 'Failed', price: 2 },
  { id: '2', lastChangedDateTime: '2026-05-27T06:39:11.252Z', orderNumber: '1767162688734', orderStatus: 'Completed', promoValue: 10, promoApplied: true, domainName: 'strangerthings.u', domainProvider: 'UD', mintStatus: 'Completed', price: 2 },
  { id: '3', lastChangedDateTime: '2026-03-24T12:15:00.219Z', orderNumber: '1766577373042', orderStatus: 'Pending', promoValue: 10, promoApplied: true, domainName: 'hellouniverse.og', domainProvider: 'UD', mintStatus: 'Pending', price: 2 },
  { id: '4', lastChangedDateTime: '2025-12-28T10:26:24.838Z', orderNumber: '1764318373493', orderStatus: 'Cancelled', promoValue: 10, promoApplied: true, domainName: 'believeit.u', domainProvider: 'UD', mintStatus: 'Failed', price: 2 },
  { id: '5', lastChangedDateTime: '2025-12-28T08:34:45.214Z', orderNumber: '1764315909085', orderStatus: 'Cancelled', promoValue: 10, promoApplied: true, domainName: 'believeit.u', domainProvider: 'UD', mintStatus: 'Failed', price: 2 },
  { id: '6', lastChangedDateTime: '2025-11-28T07:42:36.448Z', orderNumber: '1764315627267', orderStatus: 'Completed', promoValue: null, promoApplied: false, domainName: 'codemint.bnb', domainProvider: 'BinanceSmartChain', mintStatus: 'Completed', price: 5 },
  { id: '7', lastChangedDateTime: '2025-11-05T07:57:58.332Z', orderNumber: '1762329038686', orderStatus: 'Completed', promoValue: null, promoApplied: false, domainName: 'tpenguofficial.og', domainProvider: 'UD', mintStatus: 'Completed', price: 2 },
  { id: '8', lastChangedDateTime: '2025-10-20T14:00:00.000Z', orderNumber: '1758329038700', orderStatus: 'Completed', promoValue: null, promoApplied: false, domainName: 'darkforest.eth', domainProvider: 'ENS', mintStatus: 'Completed', price: 25 },
  { id: '9', lastChangedDateTime: '2025-12-01T10:00:00.000Z', orderNumber: '1763129038800', orderStatus: 'Completed', promoValue: 15, promoApplied: true, domainName: 'cryptowave.eth', domainProvider: 'ENS', mintStatus: 'Completed', price: 20 },
  { id: '10', lastChangedDateTime: '2026-01-15T10:00:00.000Z', orderNumber: '1765562185100', orderStatus: 'Completed', promoValue: null, promoApplied: false, domainName: 'jackandjill.og', domainProvider: 'UD', mintStatus: 'Completed', price: 12 },
]
