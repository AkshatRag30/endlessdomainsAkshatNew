'use client'

import { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap'
import { fetchDomainTokens, createDomainTokens } from '@/core/services/api.service'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import btnstyles from '@styles/Profile-Link.module.scss'
import ToastMessage from '../toast-message'
import { CURRENCY_MAP } from '@/helpers/chaincurrency/chaincurrency'
import { CiSquarePlus } from 'react-icons/ci'
import { MdDeleteOutline } from 'react-icons/md'
import { IoCloseCircleOutline } from 'react-icons/io5'

/* ================= TYPES ================= */

type TokenTicker = keyof typeof CURRENCY_MAP

interface SelectedToken {
  ticker: TokenTicker
  value: string
}

interface TokenRow {
  id: string
  tokenUuid: string
  name: string
  value: string
  type: string
  recordKey: string
}

interface DomainTokensManagerProps {
  domainData: any
}

/* ================= CONFIG ================= */

const SUPPORTED_TOKENS_CONFIG: {
  ticker: string
  network: string
}[] = [
  { ticker: 'ETH', network: 'Ethereum / Layer 2s' },
  { ticker: 'BNB', network: 'BNB Smart Chain (BSC)' },
  { ticker: 'MATIC', network: 'Polygon Network' },
  { ticker: 'SOL', network: 'Solana' },
  { ticker: 'BASE', network: 'Base (Coinbase L2)' },
  { ticker: 'FTN', network: 'Bahamut' },
  { ticker: 'BTC', network: 'Bitcoin' },
  { ticker: 'LTC', network: 'Litecoin' },
  { ticker: 'DOGE', network: 'Dogecoin' },
  { ticker: 'XRP', network: 'Ripple / XRP Ledger' },
  { ticker: 'TRX', network: 'TRON' },
  { ticker: 'USDT', network: 'Tether (Multi-chain)' },
  { ticker: 'USDC', network: 'USD Coin (Multi-chain)' },
  { ticker: 'DAI', network: 'Dai Stablecoin (Multi-chain)' },
]

/* ================= COMPONENT ================= */

const DomainTokensManager = ({ domainData }: DomainTokensManagerProps) => {
  const [tokens, setTokens] = useState<TokenRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [selectedTokens, setSelectedTokens] = useState<SelectedToken[]>([])

  const zoneUuid = domainData.freenameZoneUuid

  /* ================= FETCH ================= */

  useEffect(() => {
    if (zoneUuid) fetchTokens()
  }, [zoneUuid])

  const fetchTokens = async () => {
    try {
      setLoading(true)
      const res = await fetchDomainTokens(zoneUuid)
      if (res?.tokens) setTokens(res.tokens)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= HANDLERS ================= */

  const handleAddTokenFromModal = (ticker: string) => {
    const typedTicker = ticker as TokenTicker

    setSelectedTokens(prev => {
      if (prev.find(t => t.ticker === typedTicker)) return prev
      return [...prev, { ticker: typedTicker, value: '' }]
    })
  }

  const handleTokenValueChange = (index: number, value: string) => {
    const updated = [...selectedTokens]
    updated[index].value = value
    setSelectedTokens(updated)
  }

  const handleRemoveToken = (index: number) => {
    const updated = [...selectedTokens]
    updated.splice(index, 1)
    setSelectedTokens(updated)
  }

  const handleCreateTokens = async () => {
    try {
      const payload = selectedTokens
        .filter(t => t.value)
        .map(t => ({
          type: 'TOKEN',
          name: t.ticker,
          value: t.value,
        }))

      if (payload.length === 0) {
        ToastMessage(TOAST_TYPE.ERROR, '', 'Please add at least one wallet address')
        return
      }

      setActionLoading(true)

      await createDomainTokens(zoneUuid, payload)

      ToastMessage(TOAST_TYPE.SUCCESS, '', 'Tokens added successfully')

      setSelectedTokens([])
      fetchTokens()
    } catch (err: any) {
      ToastMessage(TOAST_TYPE.ERROR, '', err.message)
    } finally {
      setActionLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <>
      <div className={btnstyles.sidenav_item_freename}>
        {/* HEADER */}
        <div>
          <h5 className="fw-semibold mb-1">Token Records</h5>
          <p className="text-muted small">Manage crypto wallet addresses</p>
        </div>

        {/* EXISTING TOKENS */}
        <div className="table-responsive border rounded mt-3">
          <table className={`table mb-0 ${btnstyles.table_freename}`}>
            <thead className="table-light">
              <tr>
                <th>Token</th>
                <th>Network</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    <Spinner size="sm" />
                  </td>
                </tr>
              ) : tokens.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-3 text-muted">
                    No tokens added
                  </td>
                </tr>
              ) : (
                tokens.map(token => {
                  const config = SUPPORTED_TOKENS_CONFIG.find(t => t.ticker === token.name)

                  return (
                    <tr key={token.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={CURRENCY_MAP[token.name as keyof typeof CURRENCY_MAP]?.icon || '/default-token.png'}
                            alt={token.name}
                            width={22}
                            height={22}
                            style={{ objectFit: 'contain' }}
                          />

                          <span>{token.name}</span>
                        </div>
                      </td>
                      <td>
                        <span>{config?.network}</span>
                      </td>
                      <td>{token.value}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* SELECTED TOKENS */}
        <div className="mt-3">
          {selectedTokens.map((token, index) => {
            const currency = CURRENCY_MAP[token.ticker] ?? {
              name: token.ticker,
              icon: '/default-token.png',
            }

            const config = SUPPORTED_TOKENS_CONFIG.find(t => t.ticker === token.ticker)

            return (
              <div key={index} className={btnstyles.show_currency_name}>
                <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                  <div className="d-flex align-items-center gap-2">
                    <img src={currency.icon} width={28} height={28} style={{ objectFit: 'contain' }} />

                    <div>
                      <h5>{currency.name}</h5>
                      <h6>{config?.network}</h6>
                    </div>
                  </div>

                  <Button className="text-danger bg-transparent outline-none border-0" onClick={() => handleRemoveToken(index)}>
                    <MdDeleteOutline />
                  </Button>
                </div>

                <input
                  className="form-control"
                  placeholder="Enter wallet address"
                  value={token.value}
                  onChange={e => handleTokenValueChange(index, e.target.value)}
                />
              </div>
            )
          })}

          <div className="d-md-flex justify-content-between align-items-center">
            {/* ADD BUTTON */}
            <button className={btnstyles.addCurrrency} onClick={() => setShowCreateModal(true)}>
              <CiSquarePlus /> Add Currency
            </button>
            {selectedTokens.length > 0 && (
              <button className={btnstyles.save_tokens} onClick={handleCreateTokens} disabled={actionLoading}>
                {actionLoading ? <Spinner size="sm" /> : 'Save Tokens'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <Modal isOpen={showCreateModal} toggle={() => setShowCreateModal(false)} centered size="md">
        <div>
          <div className={btnstyles.header_freename}>
            <span>Select Tokens</span>
            <button onClick={() => setShowCreateModal(false)}>
              <IoCloseCircleOutline />
            </button>
          </div>
        </div>
        <ModalBody className={btnstyles.freename_currency_modal}>
          {SUPPORTED_TOKENS_CONFIG.map(token => {
            const currency = CURRENCY_MAP[token.ticker as TokenTicker] ?? {
              name: token.ticker,
              icon: '/default-token.png',
            }

            const isAdded = selectedTokens.some(t => t.ticker === token.ticker)

            return (
              <div key={token.ticker} className={`d-flex justify-content-between ${btnstyles.token_ticker}`}>
                <div className="d-flex gap-2 align-items-center">
                  <img src={currency.icon} width={28} height={28} style={{ objectFit: 'contain' }} />

                  <div>
                    <h5>{currency.name}</h5>
                    <h6>{token.network}</h6>
                  </div>
                </div>

                <Button
                  disabled={isAdded}
                  onClick={() => {
                    handleAddTokenFromModal(token.ticker)
                    // setShowCreateModal(false)
                  }}
                  className={btnstyles.addCurrrency_Modal}
                >
                  {isAdded ? '' : <CiSquarePlus />}
                  {isAdded ? 'Added' : 'Add'}
                </Button>
              </div>
            )
          })}
        </ModalBody>
      </Modal>
    </>
  )
}

export default DomainTokensManager
