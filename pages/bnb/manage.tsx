import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ImSpinner9 } from 'react-icons/im'
import { Button } from 'reactstrap'
import BNBDomainDetails from '@/component/manage-bnb/BNBDomainDetails'
import BNBReverseResolution from '@/component/manage-bnb/BNBReverseResolution'
import BNBSidebar from '@/component/manage-bnb/BNBSidebar'
import BNBTransfer from '@/component/manage-bnb/BNBTransfer'
import ParkedDomains from '@/component/manage-domain/park-domain'
import ToastMessage from '@/component/toast-message'
import { Cookie_Key } from '@/core/enum/cookie.enum'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import { handleConnectWallet, handleDomainOwnerDetails, handleSwitch } from '@/helpers/bnb'
import { validateDomain } from '@/helpers/parked-domains'
import Layout from '@/template/layout'
import { useAccount, useDisconnect } from 'wagmi'
import btnstyles from '@styles/Profile-Link.module.scss'
import WalletConnectModal from 'pages/ens/WalletConnectModal'
import { getCookieValue, setCookieValue } from '@/core/services/cookies.service'
import { useAppKitProvider } from '@reown/appkit/react'
import { useProviderReady } from '@/lib/useProviderReady'
import providerManager from '@/lib/provider-manager'
import { useProviderReadyInitial } from 'pages/Initial'

const ManageBNBPage = () => {
  const meta = {
    title: 'Manage your BNB Domain',
    description: 'Manage your BNB Domain',
  }

  const router = useRouter()
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { initialized } = useProviderReady()

  const { reinitialize } = useProviderReadyInitial()
  const { walletProvider } = useAppKitProvider('eip155')
  const [domain, setDomain] = useState('')
  const [domainOwnerAddress, setDomainOwnerAddress] = useState('')
  const [domainExpireDate, setDomainExpireDate] = useState('')
  const [error, setError] = useState<string>()
  const [selectedMenu, setSelectedMenu] = useState<'transfer' | 'pd' | 'reverse'>('reverse')
  const [switchError, setSwitchError] = useState<'pending' | 'err' | 'no_err'>('no_err')
  const [isOwner, setIsOwner] = useState(false)
  const [isWalletConnectedSet, setIsWalletConnectedSet] = useState(false)
  const [_isResolved, setIsResolved] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasSwitchedNetwork, setHasSwitchedNetwork] = useState(false)
  const registredWalletADdress = getCookieValue(Cookie_Key.MANAGE_WALLET_ADDRESS)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const connectToWallet = () => toggleModal()
  const closeModel = () => setIsModalOpen(false)

  useEffect(() => {
    if (!initialized) return

    const ensureProvider = async () => {
      const provider = await reinitialize() // safe call
      if (!provider) {
        console.warn('Provider not ready yet, skipping domain handling')
        return
      }

      if (router.query.domain) {
        handleDomainChange()
      } else if (router.query.domain === '') {
        setError('No domain name provided')
        setIsResolved(true)
      }
    }

    ensureProvider()
  }, [initialized, router.query, reinitialize])

  const checkOwner = async (domainName: string) => {
    if (!domainName.endsWith('.bnb')) return

    setDomain(domainName)
    const data = await handleDomainOwnerDetails(domainName)

    if (data.error) {
      ToastMessage(TOAST_TYPE.ERROR, '', data.error)
      setIsResolved(true)
      return
    }

    if (!data) {
      ToastMessage(TOAST_TYPE.ERROR, '', "Couldn't find the domain details")
      setIsResolved(true)
      return
    }

    setIsOwner(data.isOwner || false)

    if (data.expiry && typeof data.expiry === 'number') {
      const date = new Date(0)
      date.setUTCSeconds(data.expiry)
      setDomainExpireDate(date.toString())
    }

    setDomainOwnerAddress(data.ownerAddress || '')
    setError('')
    setIsResolved(true)
  }

  const handleWalletConnected = async (domainName: string) => {
    const isWalletConnectedNew = await isWalletConnected()
    setIsWalletConnectedSet(isWalletConnectedNew)
    if (!isWalletConnectedNew) return

    try {
      if (!hasSwitchedNetwork) {
        setSwitchError('pending')
        await handleSwitch() // ✅ use the helper
        setSwitchError('no_err')
        setHasSwitchedNetwork(true)
      }
    } catch (error: any) {
      setSwitchError('err')
      setError(error?.message)
      ToastMessage(TOAST_TYPE.ERROR, '', error?.message)
      setIsResolved(true)
      return
    }

    await checkOwner(domainName as string)
  }

  const handleDomainChange = async () => {
    setHasSwitchedNetwork(false)
    const { domain } = router.query
    if (!domain) {
      setError('No domain name provided')
      setIsResolved(true)
      return
    }
    const isValid = validateDomain('bnb', domain as string)
    if (!isValid || isValid == undefined) {
      await handleWalletConnected(domain as string)
    } else {
      setError(isValid)
    }
    setIsResolved(true)
  }

  const isWalletConnected = async () => {
    const provider = providerManager.getWeb3Provider()
    const accounts = await provider.listAccounts()
    return accounts.length > 0
  }

  const handleConfirmConnect = async () => {
    setIsModalOpen(false)
    setIsResolved(false)
    const domainName = router.query?.domain
    await handleConnectWallet()
    await handleWalletConnected(domainName as string)
    setIsResolved(true)
  }

  // useEffect(() => {
  //   if (
  //     isConnected &&
  //     address?.toString() !== registredWalletADdress?.toString()
  //   ) {
  //     setCookieValue(Cookie_Key.LOGIN_TYPE, "onlyWallet");
  //     ToastMessage(
  //       TOAST_TYPE.ERROR,
  //       "",
  //       "Connected wallet does not match the registered wallet. Please connect the correct wallet."
  //     );
  //     connectToWallet();
  //     disconnect();
  //   }
  // }, [address, disconnect, isConnected]);

  useEffect(() => {
    // Case 1: Wallet connected but address does not match
    if (isConnected && address?.toString() !== registredWalletADdress?.toString()) {
      setIsResolved(true)
      setCookieValue(Cookie_Key.LOGIN_TYPE, 'onlyWallet')
      ToastMessage(TOAST_TYPE.ERROR, '', 'Connected wallet does not match the registered wallet. Please connect the correct wallet.')
      connectToWallet()
      disconnect()
    }
    console.log(!isConnected && !address)

    // Case 2: Wallet not connected (user logged in with email/password)
    if (!isConnected && !address) {
      setIsResolved(true)
      console.log('this is here')
      setCookieValue(Cookie_Key.LOGIN_TYPE, 'onlyWallet')
      connectToWallet()
      disconnect()
    }
  }, [address, disconnect, isConnected, registredWalletADdress])

  useEffect(() => {
    setCookieValue(Cookie_Key.LOGIN_TYPE, 'onlyWallet')
    if (!initialized) return

    const currentProvider = walletProvider ?? providerManager.getNewWeb3Provider()

    if (!currentProvider) {
      console.log('⚠️ No provider found → forcing reconnect')
      disconnect()
      connectToWallet()
    } else {
      // alert("✅ Provider ready");
    }
  }, [walletProvider, disconnect, initialized])

  useEffect(() => {
    if (!initialized || !router.query.domain) return

    // Only apply this on mobile devices
    if (!/Mobi|Android/i.test(navigator.userAgent)) return

    const timeout = setTimeout(() => {
      if (!_isResolved && !domainOwnerAddress) {
        console.warn('⏳ Details not loaded → forcing page reload')
        window.location.reload() // 🔥 Hard reload
      }
    }, 8000) // 8s timeout (adjust 5000–10000 ms as needed)

    return () => clearTimeout(timeout)
  }, [initialized, router.query.domain, _isResolved, domainOwnerAddress])

  if (!_isResolved)
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage BNB</h1>
            <p>Loading domain details </p>
            <p className="text-center alert alert-warning">
              If you are stuck on loading, we suggest you log out and log in again with your wallet.
            </p>
            <ImSpinner9 className="spinner" style={{ border: 0 }} />
          </div>
        </section>
      </Layout>
    )

  if (error && switchError === 'err')
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage BNB</h1>

            {switchError && (
              <Button color="primary" onClick={connectToWallet}>
                Switch Network
              </Button>
            )}
          </div>
        </section>
      </Layout>
    )

  if (error && !domain)
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage BNB</h1>
            <p>{error}</p>
          </div>
        </section>
      </Layout>
    )
  if (error)
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage BNB</h1>
            <p>{error}</p>
          </div>
        </section>
      </Layout>
    )
  if (!isWalletConnectedSet)
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage BNB</h1>
            <p>{!isWalletConnectedSet && 'Please connect your wallet'}</p>
            {!isWalletConnectedSet && (
              <>
                <Button color="primary" onClick={connectToWallet}>
                  Connect Wallet
                </Button>
                <WalletConnectModal
                  isOpen={isModalOpen}
                  toggle={toggleModal}
                  onConfirm={handleConfirmConnect}
                  walletAddress={registredWalletADdress} // Replace with actual
                  closeModel={closeModel}
                />
              </>
            )}
          </div>
        </section>
      </Layout>
    )
  return (
    <Layout metaInfo={meta}>
      <section className="py-5">
        <div className={`container ${btnstyles.sidenav_item} mx-auto`}>
          <div className="container">
            <h1>Manage your BNB Domain</h1>
          </div>
          <hr />
          <div className="d-flex justify-content-end flex-wrap flex-column flex-lg-row">
            <BNBDomainDetails domain={domain} owner={domainOwnerAddress} expiry={domainExpireDate} />
            <BNBSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}>
              {isOwner ? (
                <>
                  {selectedMenu === 'reverse' && <BNBReverseResolution domain={domain} />}
                  {selectedMenu === 'transfer' && <BNBTransfer domain={domain} />}
                  {selectedMenu === 'pd' && <ParkedDomains domain={domain} provider="bnb" />}
                </>
              ) : (
                <>
                  <h3> Sorry, you cannot manage this domain as you are not the owner</h3>
                  <h3> Please connect the wallet that owns this domain</h3>
                </>
              )}
            </BNBSidebar>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export function getServerSideProps({ req }: any) {
  if (req && !req.cookies[Cookie_Key.ACCESS_TOKEN]) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  }
}

export default ManageBNBPage
