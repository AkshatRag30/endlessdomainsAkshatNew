import { useEffect, useState } from 'react'
import { ImSpinner } from 'react-icons/im'
import { Button, CardBody, CardHeader, Col, Row } from 'reactstrap'
import btnstyles from '@styles/Profile-Link.module.scss'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import { handleGetReverseRecord, handleUpdateReverseRecord } from '@/helpers/ens'
import { BiError } from 'react-icons/bi'

import ToastMessage from '../toast-message'
import { getDomainProvider } from '@/helpers/chaincurrency/chaincurrency'

const ENSReverseResolution = ({ domain }: { domain: string }) => {
  const [error, setError] = useState<string>('')
  const [currentRecord, setCurrentRecord] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const getCurrentRecord = async () => {
    const response = await handleGetReverseRecord()
    if (response.error) {
      setError(response.error)
      return
    }
    if (!response.data) {
      return
    }

    setCurrentRecord(response.data)
    setError('')
  }

  const updatReverseResolution = async () => {
    const confirm = window.confirm('Are you sure you want to update your Reverse Record?')
    if (!confirm) return
    setLoading(true)
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      ToastMessage(TOAST_TYPE.INFO_SUCCESS, '', 'Please check your wallet and confirm the transaction.')
    }
    const response = await handleUpdateReverseRecord(domain)
    setLoading(false)
    if (response.error) {
      ToastMessage(TOAST_TYPE.ERROR, '', response.error)

      return
    }
    if (!response.data) {
      return
    }
    ToastMessage(TOAST_TYPE.SUCCESS, '', 'Reverse resolution updated successfully')

    setCurrentRecord(domain)
    setTxHash(response.data.hash)
  }

  useEffect(() => {
    getCurrentRecord()
  }, [domain])

  if (!domain)
    return (
      <>
        <div className="container">
          <p>Reverse Resolution not found</p>
        </div>
      </>
    )
  const getProvider = getDomainProvider('ENS')
  const isDisabled = domain === currentRecord || loading

  return (
    <div className={`mt-3 py-4 ${btnstyles.sidenav_item} h-auto`}>
      <CardHeader>
        <h1>Reverse Resolution</h1>
        <br />
        <p className="text-secondary">Reverse resolution links your domain name to an address on the blockchain.</p>
      </CardHeader>
      <hr></hr>
      <CardBody>
        <Row className="mt-2">
          <Col className="text-right">
            {error && (
              <p className={btnstyles.text_danger}>
                <BiError /> {error}
              </p>
            )}
            <h4>Your wallet is currently associated with the following address:</h4>
          </Col>
        </Row>
        <Row className="mt-1">
          <Col className="text-right">{currentRecord && <h2 style={{ background: getProvider?.colorName }}>{currentRecord}</h2>}</Col>
        </Row>

        <Row className="mt-3">
          <Col className="text-right">
            <Button
              disabled={isDisabled}
              onClick={updatReverseResolution}
              style={{
                backgroundColor: isDisabled ? '#bcbcbc' : '#2639ED',
                padding: '5px 20px',
                width: '200px',
                border: 0,
                color: '#fff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.7 : 1,
              }}
            >
              Update
              <ImSpinner className="ml-2 spinner" style={{ marginLeft: 5, display: loading ? 'inline-block' : 'none' }} />
            </Button>
          </Col>
        </Row>
        {txHash && (
          <Row className="mt-2">
            <Col className="text-right">
              <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">
                View transaction on Etherscan
              </a>
            </Col>
          </Row>
        )}
      </CardBody>
    </div>
  )
}

export default ENSReverseResolution
