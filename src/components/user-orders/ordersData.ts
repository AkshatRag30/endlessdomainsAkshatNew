export type OrderStatus = 'Cancelled' | 'Completed' | 'Pending' | 'Processing'

export interface DomainMint {
  id: string
  createdDateTime: string
  isDeleted: boolean
  lastChangedDateTime: string
  mintingId: string | null
  domainProvider: string
  mintStatus: string
  blockchain: string
  blockchainExplorer: string | null
  transactionId: string | null
}

export interface DomainDetail {
  id: string
  domainName: string
  domainProvider: string
  price: number
  ownerAddress: string | null
  resolver: string | null
  resolution: Record<string, unknown>
  blockchain: string
  registryAddress: string | null
  node: string | null
  userId: string
  domainMint: DomainMint[]
}

export interface OrderEntry {
  id: string
  orderNumber: string
  orderStatus: OrderStatus
  totalCost: number
  promoApplied: boolean
  promoCodeUsed: string | null
  promoValue: number | null
  domainDetailDtoList: DomainDetail[]
  paymentClientId: string
  orderState: number
  lastChangedDateTime: string
  createdDateTime: string
  txnFee: string
}

export type OrderTab = 'ALL' | 'PROCESSING' | 'COMPLETED'

const COST_DIVIDE_PROVIDERS = ['UD', 'Arbitrum', 'BinanceSmartChain', 'ENS', 'Bonfida', 'Freename']

export const getDisplayCost = (order: OrderEntry): string => {
  const provider = order.domainDetailDtoList?.[0]?.domainProvider ?? ''
  const raw = COST_DIVIDE_PROVIDERS.includes(provider) ? order.totalCost / 100 : order.totalCost
  return raw.toFixed(2)
}

export const filterOrders = (orders: OrderEntry[], tab: OrderTab): OrderEntry[] => {
  switch (tab) {
    case 'PROCESSING':
      return orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Pending')
    case 'COMPLETED':
      return orders.filter(o => o.orderStatus === 'Completed')
    default:
      return orders
  }
}

export const ORDERS_DATA: OrderEntry[] = [
  {
    id: 'bulk-order-demo-001',
    orderNumber: '1762329038999',
    orderStatus: 'Processing',
    totalCost: 600,
    promoApplied: false,
    promoCodeUsed: null,
    promoValue: null,
    domainDetailDtoList: [
      {
        id: 'bulk-d1',
        domainName: 'myawesomename.og',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [{ id: 'bm1', createdDateTime: '2025-11-01T10:00:00.000Z', isDeleted: false, lastChangedDateTime: '2025-11-01T10:00:00.000Z', mintingId: null, domainProvider: 'UD', mintStatus: 'Processing', blockchain: 'Polygon', blockchainExplorer: null, transactionId: null }],
      },
      {
        id: 'bulk-d2',
        domainName: 'mybrand.bnb',
        domainProvider: 'BinanceSmartChain',
        price: 5,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Binance Smart Chain',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [{ id: 'bm2', createdDateTime: '2025-11-01T10:00:00.000Z', isDeleted: false, lastChangedDateTime: '2025-11-01T10:00:00.000Z', mintingId: null, domainProvider: 'BinanceSmartChain', mintStatus: 'Processing', blockchain: 'Binance Smart Chain', blockchainExplorer: null, transactionId: null }],
      },
      {
        id: 'bulk-d3',
        domainName: 'coolbrand.arb',
        domainProvider: 'Arbitrum',
        price: 3,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Arbitrum',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [{ id: 'bm3', createdDateTime: '2025-11-01T10:00:00.000Z', isDeleted: false, lastChangedDateTime: '2025-11-01T10:00:00.000Z', mintingId: null, domainProvider: 'Arbitrum', mintStatus: 'Processing', blockchain: 'Arbitrum', blockchainExplorer: null, transactionId: null }],
      },
      {
        id: 'bulk-d4',
        domainName: 'stellar.og',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [{ id: 'bm4', createdDateTime: '2025-11-01T10:00:00.000Z', isDeleted: false, lastChangedDateTime: '2025-11-01T10:00:00.000Z', mintingId: null, domainProvider: 'UD', mintStatus: 'Processing', blockchain: 'Polygon', blockchainExplorer: null, transactionId: null }],
      },
      {
        id: 'bulk-d5',
        domainName: 'nexusfi.eth',
        domainProvider: 'ENS',
        price: 4,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Ethereum',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [{ id: 'bm5', createdDateTime: '2025-11-01T10:00:00.000Z', isDeleted: false, lastChangedDateTime: '2025-11-01T10:00:00.000Z', mintingId: null, domainProvider: 'ENS', mintStatus: 'Processing', blockchain: 'Ethereum', blockchainExplorer: null, transactionId: null }],
      },
      {
        id: 'bulk-d6',
        domainName: 'daoverse.freename',
        domainProvider: 'Freename',
        price: 6,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Ethereum',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [{ id: 'bm6', createdDateTime: '2025-11-01T10:00:00.000Z', isDeleted: false, lastChangedDateTime: '2025-11-01T10:00:00.000Z', mintingId: null, domainProvider: 'Freename', mintStatus: 'Processing', blockchain: 'Ethereum', blockchainExplorer: null, transactionId: null }],
      },
    ],
    paymentClientId: 'pi_bulk_demo',
    orderState: 1,
    lastChangedDateTime: '2025-11-01T10:00:00.000Z',
    createdDateTime: '2025-11-01T10:00:00.000Z',
    txnFee: '0.00',
  },
  {
    id: 'f12f43ca-c5bb-4103-b306-ab26e9b20bb0',
    orderNumber: '1767162185293',
    orderStatus: 'Cancelled',
    totalCost: 200,
    promoApplied: true,
    promoCodeUsed: null,
    promoValue: null,
    domainDetailDtoList: [
      {
        id: 'f9e15a74-3749-481d-8515-c03d260c175f',
        domainName: 'strangerthings.u',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: '625885e9-5dcc-4441-8e64-f145a4a7c601',
            createdDateTime: '2025-12-31T06:23:05.482Z',
            isDeleted: false,
            lastChangedDateTime: '2025-12-31T06:30:55.551Z',
            mintingId: null,
            domainProvider: 'UD',
            mintStatus: 'Failed',
            blockchain: 'Polygon',
            blockchainExplorer: null,
            transactionId: null,
          },
        ],
      },
    ],
    paymentClientId: 'pi_3SkIoHKOMngriNmF1IU7wRej',
    orderState: 1,
    lastChangedDateTime: '2025-12-31T06:58:07.430Z',
    createdDateTime: '2025-12-31T06:23:05.482Z',
    txnFee: '0.00',
  },
  {
    id: '1a896ecc-1447-4e7f-b693-9b74982775d3',
    orderNumber: '1767162688734',
    orderStatus: 'Completed',
    totalCost: 180,
    promoApplied: true,
    promoCodeUsed: 'VIJAY10',
    promoValue: 10,
    domainDetailDtoList: [
      {
        id: 'c4e83ff8-556e-44bb-b593-904f74c4630e',
        domainName: 'strangerthings.u',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: '0xe572962a4C5335BccB787332F5b0b2CC7Af48A08',
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f',
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: 'fce3faff-5e1a-4610-825a-f54a857ea7ea',
            createdDateTime: '2025-12-31T06:31:28.906Z',
            isDeleted: false,
            lastChangedDateTime: '2025-12-31T06:39:11.198Z',
            mintingId: null,
            domainProvider: 'UD',
            mintStatus: 'Completed',
            blockchain: 'Polygon',
            blockchainExplorer: 'https://polygonscan.com/tx/0x36fb05348eca8425385cf7c3c4767db079393a3e5e65a33626960d973672c61e',
            transactionId: '0x36fb05348eca8425385cf7c3c4767db079393a3e5e65a33626960d973672c61e',
          },
        ],
      },
    ],
    paymentClientId: 'pi_3SkIwOKOMngriNmF1BAbpD70',
    orderState: 1,
    lastChangedDateTime: '2025-12-31T06:39:11.252Z',
    createdDateTime: '2025-12-31T06:31:28.906Z',
    txnFee: '0.00',
  },
  {
    id: '91a8c8a8-51b3-4c8b-9094-b5ec4969bfac',
    orderNumber: '1766577373042',
    orderStatus: 'Pending',
    totalCost: 180,
    promoApplied: true,
    promoCodeUsed: 'VIJAY10',
    promoValue: 10,
    domainDetailDtoList: [
      {
        id: 'b4b790b2-ce50-47ca-ad63-dd4fbdd2f12a',
        domainName: 'hellouniverse.og',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: '9c5876c0-8ca2-4c65-8edc-0d88eaf3bfd4',
            createdDateTime: '2025-12-24T11:56:13.248Z',
            isDeleted: false,
            lastChangedDateTime: '2025-12-24T11:56:13.248Z',
            mintingId: null,
            domainProvider: 'UD',
            mintStatus: 'Pending',
            blockchain: 'Polygon',
            blockchainExplorer: null,
            transactionId: null,
          },
        ],
      },
    ],
    paymentClientId: 'pi_3ShqfpKOMngriNmF1nrADRgg',
    orderState: 1,
    lastChangedDateTime: '2025-12-24T12:15:00.219Z',
    createdDateTime: '2025-12-24T11:56:13.248Z',
    txnFee: '0.00',
  },
  {
    id: 'cd9d9bf0-0fe0-4c70-b1c8-7472709fda0e',
    orderNumber: '1764318373493',
    orderStatus: 'Cancelled',
    totalCost: 180,
    promoApplied: true,
    promoCodeUsed: 'BLKFRIUD',
    promoValue: 10,
    domainDetailDtoList: [
      {
        id: '57786166-f644-4680-b675-bb12c9f4afa5',
        domainName: 'believeit.u',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: '894f315e-6f23-4a7b-83db-47bb3d0adf07',
            createdDateTime: '2025-11-28T08:26:13.658Z',
            isDeleted: false,
            lastChangedDateTime: '2025-11-28T08:58:07.787Z',
            mintingId: null,
            domainProvider: 'UD',
            mintStatus: 'Failed',
            blockchain: 'Polygon',
            blockchainExplorer: null,
            transactionId: null,
          },
        ],
      },
    ],
    paymentClientId: 'pi_3SYN0LKOMngriNmF0rDIjICk',
    orderState: 1,
    lastChangedDateTime: '2025-11-28T10:26:24.838Z',
    createdDateTime: '2025-11-28T08:26:13.658Z',
    txnFee: '0.00',
  },
  {
    id: '6828b970-1c9a-43b5-a93b-a59ec0d0b08b',
    orderNumber: '1764315909085',
    orderStatus: 'Cancelled',
    totalCost: 180,
    promoApplied: true,
    promoCodeUsed: 'BLKFRIUD',
    promoValue: 10,
    domainDetailDtoList: [
      {
        id: 'df40ed95-965a-4132-8435-97dc7707a8e3',
        domainName: 'believeit.u',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: null,
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: null,
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: 'a99a75cc-200b-4c25-b1d4-3354d306699f',
            createdDateTime: '2025-11-28T07:45:09.287Z',
            isDeleted: false,
            lastChangedDateTime: '2025-11-28T08:25:16.924Z',
            mintingId: null,
            domainProvider: 'UD',
            mintStatus: 'Failed',
            blockchain: 'Polygon',
            blockchainExplorer: null,
            transactionId: null,
          },
        ],
      },
    ],
    paymentClientId: 'pi_3SYMMbKOMngriNmF0XBPPzz7',
    orderState: 1,
    lastChangedDateTime: '2025-11-28T08:34:45.214Z',
    createdDateTime: '2025-11-28T07:45:09.287Z',
    txnFee: '0.00',
  },
  {
    id: '12bb9160-9cdd-464f-bcc5-8aa8f8b60b23',
    orderNumber: '1764315627267',
    orderStatus: 'Completed',
    totalCost: 500,
    promoApplied: true,
    promoCodeUsed: null,
    promoValue: null,
    domainDetailDtoList: [
      {
        id: 'e7ffe2de-484d-4b8d-9fa8-c2daf0141cdc',
        domainName: 'codemint.bnb',
        domainProvider: 'BinanceSmartChain',
        price: 5,
        ownerAddress: '0xe572962a4C5335BccB787332F5b0b2CC7Af48A08',
        resolver: null,
        resolution: {},
        blockchain: 'Binance Smart Chain',
        registryAddress: '0xD9A99AE1f5D173cCf36E19777ACa5B8268B5F291',
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: '7fc7803d-22c5-491f-affb-c8464c4e11d2',
            createdDateTime: '2025-11-28T07:40:27.442Z',
            isDeleted: false,
            lastChangedDateTime: '2025-11-28T07:42:36.448Z',
            mintingId: null,
            domainProvider: 'BinanceSmartChain',
            mintStatus: 'Completed',
            blockchain: 'Binance Smart Chain',
            blockchainExplorer: 'https://bscscan.com/tx/0x385cf2a87caa8a5f901aa020de7432e256f773c149c5937542e9cdacc5e6417f',
            transactionId: '0x385cf2a87caa8a5f901aa020de7432e256f773c149c5937542e9cdacc5e6417f',
          },
        ],
      },
    ],
    paymentClientId: 'pi_3SYMI3KOMngriNmF1gdLTqFr',
    orderState: 1,
    lastChangedDateTime: '2025-11-28T07:42:36.448Z',
    createdDateTime: '2025-11-28T07:40:27.442Z',
    txnFee: '0.00',
  },
  {
    id: '77f6317e-f640-4d9a-88d4-cff18b559b9a',
    orderNumber: '1762329038686',
    orderStatus: 'Completed',
    totalCost: 200,
    promoApplied: true,
    promoCodeUsed: null,
    promoValue: null,
    domainDetailDtoList: [
      {
        id: '107f638d-9e57-4db8-bfbb-fe887106cf03',
        domainName: 'tpenguofficial.og',
        domainProvider: 'UD',
        price: 2,
        ownerAddress: '0xe572962a4C5335BccB787332F5b0b2CC7Af48A08',
        resolver: null,
        resolution: {},
        blockchain: 'Polygon',
        registryAddress: '0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f',
        node: null,
        userId: '0d8f1574-7691-4d78-9161-96ae7059af69',
        domainMint: [
          {
            id: '33cdc5f6-03a7-4fe1-b96e-b36eb43b320e',
            createdDateTime: '2025-11-05T07:50:38.883Z',
            isDeleted: false,
            lastChangedDateTime: '2025-11-05T07:57:58.272Z',
            mintingId: null,
            domainProvider: 'UD',
            mintStatus: 'Completed',
            blockchain: 'Polygon',
            blockchainExplorer: 'https://polygonscan.com/tx/0xc53810259804aa68ed5ae82594595ff7f2ce9995fe9516bb243b0d88ddbe7069',
            transactionId: '0xc53810259804aa68ed5ae82594595ff7f2ce9995fe9516bb243b0d88ddbe7069',
          },
        ],
      },
    ],
    paymentClientId: 'pi_3SQ1UIKOMngriNmF0gs4DTBs',
    orderState: 1,
    lastChangedDateTime: '2025-11-05T07:57:58.332Z',
    createdDateTime: '2025-11-05T07:50:38.883Z',
    txnFee: '0.00',
  },
]
