import { useState } from 'react'
import { ImSpinner } from 'react-icons/im'
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import btnstyles from '@styles/Profile-Link.module.scss'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import { handleTransferDomain } from '@/helpers/arb'
import ToastMessage from '../toast-message'
import * as apiService from "@/core/services/api.service";
import { API_ENDPOINT } from '@/core/enum/api-endpoint.enum'
import { useRouter } from 'next/router'
import { BiError } from 'react-icons/bi'

const ARBTransfer = ({ domain }: { domain: string }) => {
  const [newOwner, setNewOwner] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const ROUTER = useRouter()
const [agreements, setAgreements] = useState({
    c1: false,
    c2: false,
    c3: false,
  })
  const allChecked = Object.values(agreements).every(Boolean)

  const handleTransfer = async () => {
    const res = [1, 2, 3].map(i => {
      const agreeClause = document.getElementById(`agree-clause-${i}`) as HTMLInputElement
      if (!agreeClause.checked) {
        setError('Please agree to all the clauses')
        return false
      }
    })
    if (newOwner.length !== 42) {
      setError('Invalid address')
      return
    }
    if (res.includes(false)) return
    else setError('')
    setLoading(true)
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      ToastMessage(TOAST_TYPE.INFO_SUCCESS, '', 'Please check your wallet and confirm the transaction.')
    }
    const result = await handleTransferDomain(domain, newOwner)
    console.error(result.error)
    console.error(result.data)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (!result.data) {
      setError('Something went wrong')
      return
    }
    setError('')
    setNewOwner('')
    ToastMessage(TOAST_TYPE.SUCCESS, '', 'Domain transferred successfully')
    ToastMessage(TOAST_TYPE.SUCCESS, '', 'We are fetching your updated domains. This may take a few seconds. If you don’t see the latest update, please hit the refresh icon.')
    ROUTER.push('/profile/domains');

    // ✅ Background refresh (DO NOT BLOCK UI)
    await apiService
      .getApi(`${API_ENDPOINT.REFRESH_MY_DOMAINS}?limit=100`, true)
      .catch((err: any) => {
        console.error('Refresh domains API failed', err)
        // silently fail — UX is not affected
      })
  }

  const handleCheckboxChange = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
  }
  return (
    <div className={`${btnstyles.sidenav_item} h-auto mt-3 py-4`}>
      <CardHeader>
        <h1>Transfer your ARB domain to another wallet</h1>
        <p className='text-secondary'>
          You must have the private key in order to manage your domain. If you transfer this domain to an exchange or any other custodial
          account where you do not control the private key, you will not be able to access your domain. Not your keys, not your domain.
        </p>
      </CardHeader>
      <hr className="my-2"></hr>
      <CardBody>        
        <Row className="mt-2">
          <Col>
            { error && <p className={btnstyles.text_danger}><BiError />{" "}{" "} {error}</p>}
          </Col>
        </Row>

        <Row>
           <Col>
            <b style={{ marginRight: 10 }}>Recipient Address:</b>
            <br />
            <input
              type="text"
              name="recipient-address"
              id="recipient-address"
              placeholder="Enter your ETH/ARB Address"
              style={{ width: '80%', padding: '10px', borderRadius: '8px', border: error ? '1px solid #991B1B' : '1px solid rgb(103 103 103)' }}
              value={newOwner}
              onChange={e => setNewOwner(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="form-check">
            <input
              type="checkbox"
                id="agree-clause-1"
                className="form-check-input"
                checked={agreements.c1}
                onChange={() => handleCheckboxChange('c1')}
            />
            <label htmlFor="agree-clause-1" style={{ color: agreements.c1 == true ? "#000" : "rgb(103 103 103)"}}>I agree that I am transferring ownership of this domain and this action is irreversible.</label>
         </div>
         </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <div className="form-check">
            <input
               className="form-check-input"
                type="checkbox"
                id="agree-clause-2"
                checked={agreements.c2}
                onChange={() => handleCheckboxChange('c2')}
            />
            <label htmlFor="agree-clause-2" style={{ color: agreements.c1 == true ? "#000" : "rgb(103 103 103)"}}>I&apos;m not transferring this domain to an exchange or any other custodial account.</label>
         </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <div className="form-check">
            <input
              type="checkbox"
                className="form-check-input"
                id="agree-clause-3"
                checked={agreements.c3}
                onChange={() => handleCheckboxChange('c3')}
            />
            <label htmlFor="agree-clause-3" style={{ color: agreements.c1 == true ? "#000" : "rgb(103 103 103)"}}>I&apos;m transferring this domain to an ARB Address.</label>
         </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-right">
            <Button
              color="primary"
              disabled={!allChecked || loading}
              onClick={handleTransfer}
                style={{
                backgroundColor: allChecked ? '#2639ED' : '#e0e0e0',
                borderColor: allChecked ? '#2639ED' : '#e0e0e0',
                color: allChecked ? '#fff' : '#9e9e9e',
                cursor: allChecked ? 'pointer' : 'not-allowed',
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

export default ARBTransfer
