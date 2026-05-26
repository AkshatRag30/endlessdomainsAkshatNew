export type FreenameViewMenu = 'records' | 'token' | 'transfer'

export interface DnsRecord {
  id: string
  type: string
  host: string
  content: string
  ttl: number
}

export interface FreenameDomainData {
  fullName: string
  orderId: string
  status: string
  registrationDate: string
}
