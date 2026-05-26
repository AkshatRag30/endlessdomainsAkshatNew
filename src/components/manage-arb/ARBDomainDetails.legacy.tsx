import { Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import btnstyles from '@styles/Profile-Link.module.scss'
import { getDomainProvider } from '@/helpers/chaincurrency/chaincurrency'
import Image from 'next/image'
import { useState } from 'react'
import { MdContentCopy } from 'react-icons/md'

interface ARBDomainDetailsProps {
  domain: string
  owner: string
  expiry: string
  provider?: string
}
const ARBDomainDetails = ({ domain, owner, expiry, provider = 'Arbitrum' }: ARBDomainDetailsProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(owner)
    setCopied(true)

    setTimeout(() => setCopied(false), 1500)
  }

  const formatExpiry = (date: string | Date) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear().toString().slice(-2)

    return `${day}/${month}/${year}`
  }
  const getProvider = getDomainProvider('Arbitrum')
  return (
    <Col lg={9} className="order-1">
      <Card className={btnstyles.sidenav_item}>
        <h2 style={{ background: getProvider?.colorName }}>{domain}</h2>
        <div>
          <Row>
            <Col md={3}>
              <b>Domain Provider:</b>
            </Col>
            <Col>
              <h3>
                {getProvider && <Image src={getProvider.image} alt={getProvider.label} width={24} height={24} />} {getProvider?.label} (
                {provider})
              </h3>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={3}>
              <b>Owner:</b>
            </Col>
            <Col md={9}>
              <div className="d-flex align-items-center gap-2">
                <span className={`${btnstyles.owner_txt}`} title={owner}>
                  {owner}
                </span>

                <span id="copy-owner" onClick={handleCopy} style={{ cursor: 'pointer' }}>
                  <MdContentCopy />
                </span>

                <UncontrolledTooltip placement="top" target="copy-owner">
                  {copied ? 'Copied!' : 'Copy'}
                </UncontrolledTooltip>
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={3}>
              <b>Expiry:</b>
            </Col>
            <Col>
              <h3 className={btnstyles.expiry_txt}>{formatExpiry(expiry)}</h3>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  )
}

export default ARBDomainDetails
