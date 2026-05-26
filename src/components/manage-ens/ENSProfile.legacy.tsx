import { useEffect, useState } from 'react'
import { ImSpinner } from 'react-icons/im'
import { Button, CardBody, CardHeader, Col, Row } from 'reactstrap'
import btnstyles from '@styles/Profile-Link.module.scss'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import { handleGetProfileData, handleUpdateProfileData } from '@/helpers/ens'

import ToastMessage from '../toast-message'

const ENSProfile = ({ domain }: { domain: string }) => {
  const [error, setError] = useState<string>('')
  const [profileData, setProfileData] = useState<Array<string>>(new Array(12).fill(''))
  const [initialProfileData, setInitialProfileData] = useState<Array<string>>(new Array(12).fill(''))

  const [loading, setLoading] = useState(false)
  const getProfileData = async () => {
    const response = await handleGetProfileData(domain)
    if (response.error) {
      setError(response.error)
      return
    }
    if (!response.data) {
      return
    }
    setProfileData(response.data)
    setError('')
  }

  const handleProfileDataChange = (index: number, value: string) => {
    const newProfileData = [...profileData]
    newProfileData[index] = value
    setProfileData(newProfileData)
  }

  const updateProfileData = async () => {
    const confirm = window.confirm('Are you sure you want to update your profile data?')
    if (!confirm) return
    setLoading(true)
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      ToastMessage(TOAST_TYPE.INFO_SUCCESS, '', 'Please check your wallet and confirm the transaction.')
    }
    const response = await handleUpdateProfileData(domain, profileData)
    setLoading(false)
    if (response.error) {
      ToastMessage(TOAST_TYPE.ERROR, '', response.error)

      return
    }
    if (!response.data) {
      return
    }
    ToastMessage(TOAST_TYPE.SUCCESS, '', 'Profile data updated successfully')

    setProfileData(response.data)
    setInitialProfileData(response.data)
  }

  useEffect(() => {
    getProfileData()
  }, [domain])
  if (!domain)
    return (
      <>
        <div className="container">
          <p>Profile details not found</p>
        </div>
      </>
    )
  const isDisabled = JSON.stringify(profileData) === JSON.stringify(initialProfileData) || loading

  return (
    <div className={`${btnstyles.sidenav_item} h-auto mt-3`}>
      <CardHeader>
        <h1>Profile</h1>
      </CardHeader>
      <hr className="my-2"></hr>
      <CardBody>
        <p>
          {error !== '' && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </p>
        {[
          'Email',
          'Mobile',
          'Description',
          'Twitter',
          'Facebook',
          'LinkedIn',
          'Discord',
          'Telegram',
          'Instagram',
          'Github',
          'Reddit',
          'URL',
        ].map((item, index) => (
          <Row className="mt-2" key={index}>
            <Col md={2}>
              <label>
                <b>{item}</b>
              </label>
            </Col>
            <Col md={9}>
              <input
                type="text"
                className="form-control"
                defaultValue={profileData[index]}
                onChange={e => handleProfileDataChange(index, e.target.value)}
              />
            </Col>
          </Row>
        ))}
        <Row className="mt-2">
          <Col className="text-right">
            <Button
              disabled={isDisabled}
              onClick={updateProfileData}
              style={{
                padding: '5px 20px',
                width: '200px',
                marginTop: '20px',
                border: 0,
                backgroundColor: isDisabled ? '#bcbcbc' : '#2639ED',
                color: '#fff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.7 : 1,
              }}
            >
              Save Changes
              <ImSpinner className="ml-2 spinner" style={{ marginLeft: 5, display: loading ? 'inline-block' : 'none' }} />
            </Button>
          </Col>
        </Row>
      </CardBody>
    </div>
  )
}

export default ENSProfile
