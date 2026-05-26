import { useEffect, useState } from 'react'
import { ImSpinner } from 'react-icons/im'
import { Button, CardBody, CardHeader, Col, Row } from 'reactstrap'
import btnstyles from '@styles/Profile-Link.module.scss'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import { handleCryptoData, handleUpdateCryptoData } from '@/helpers/ens'

import ToastMessage from '../toast-message'

const ENSCrypto = ({ domain }: { domain: string }) => {
  const [cryptoData, setCryptoData] = useState<Array<string>>(new Array(5).fill(''))
  const [initialCryptoData, setInitialCryptoData] = useState<Array<string>>(new Array(5).fill(''))
  const [loading, setLoading] = useState(false)
  const getInitialData = async () => {
    const res = await handleCryptoData(domain)
    if (res.error) {
      console.error(res.error)
      return
    }
    if (!res.data) {
      ToastMessage(TOAST_TYPE.ERROR, '', 'Crypto data not found')
      return
    }
    setCryptoData(res.data)
    setInitialCryptoData(res.data)
  }

  const handleCryptoDataChange = (index: number, value: string) => {
    const newCryptoData = [...cryptoData]
    newCryptoData[index] = value
    setCryptoData(newCryptoData)
  }

  const updateCryptoData = async () => {
    const confirm = window.confirm('Are you sure you want to update your crypto data?')
    if (!confirm) return
    setLoading(true)
    try {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        ToastMessage(TOAST_TYPE.INFO_SUCCESS, '', 'Please check your wallet and confirm the transaction.')
      }
      const res = await handleUpdateCryptoData(domain, cryptoData)
      setLoading(false)
      if (res.error) {
        ToastMessage(TOAST_TYPE.ERROR, '', res.error)
        return
      }
      if (!res.data) {
        return
      }
      ToastMessage(TOAST_TYPE.SUCCESS, '', 'Crypto data updated successfully')
      setCryptoData(res.data)
      setInitialCryptoData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getInitialData()
  }, [domain])

  if (!domain)
    return (
      <>
        <div className="container">
          <p>Domain details not found</p>
        </div>
      </>
    )

  const currencyMeta: Record<string, { name: string; icon: string }> = {
    BTC: { name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/thumbs/bitcoin.png' },
    LTC: { name: 'Litecoin', icon: 'https://cryptologos.cc/logos/thumbs/litecoin.png' },
    DOGE: { name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/thumbs/dogecoin.png' },
    ETH: { name: 'Ethereum', icon: 'https://cryptologos.cc/logos/thumbs/ethereum.png' },
    MATIC: { name: 'Polygon', icon: 'https://cryptologos.cc/logos/thumbs/polygon.png' },
  }

  const currencies = ['BTC', 'LTC', 'DOGE', 'ETH', 'MATIC']
  const isDisabled = JSON.stringify(cryptoData) === JSON.stringify(initialCryptoData) || loading
  return (
    <div className={`mt-3 ${btnstyles.sidenav_item} h-auto py-4`}>
      <CardHeader>
        <h1>Link crypto currency addresses</h1>
        <p className="text-secondary">Add crypto currency addresses to send and receive crypto currency via your ENS domain.</p>
      </CardHeader>
      <hr />
      <CardBody>
        {currencies.map((symbol, index) => (
          <div className="mt-3">
            <Row key={symbol} className="align-items-center mb-2">
              <Col md={3} className="d-flex align-items-center gap-2">
                <img src={currencyMeta[symbol].icon} width={20} height={20} />
                <b>{currencyMeta[symbol].name}</b>
              </Col>
            </Row>
            <Row>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  value={cryptoData[index]}
                  onChange={e => handleCryptoDataChange(index, e.target.value)}
                />
              </Col>
            </Row>
          </div>
        ))}

        <Row className="mt-3">
          <Col className="text-right">
            <Button
              disabled={isDisabled}
              onClick={updateCryptoData}
              style={{
                backgroundColor: isDisabled ? '#bcbcbc' : '#2639ED',
                borderColor: isDisabled ? '#bcbcbc' : '#2639ED',
                color: '#fff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.7 : 1,
                width: "200px"
              }}
            >
              Save Changes
              <ImSpinner
                className="ml-2 spinner"
                style={{
                  marginLeft: 5,
                  display: loading ? 'inline-block' : 'none',
                }}
              />
            </Button>
          </Col>
        </Row>
      </CardBody>
    </div>
  )
}

export default ENSCrypto
