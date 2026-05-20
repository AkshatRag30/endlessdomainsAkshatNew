import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ImSpinner9 } from 'react-icons/im'
import { Button, Row } from 'reactstrap'
import ParkedDomains from '@/component/manage-domain/park-domain'
import ENSCrypto from '@/component/manage-ens/ENSCrypto'
import ENSDomainDetails from '@/component/manage-ens/ENSDomainDetails'
import ENSProfile from '@/component/manage-ens/ENSProfile'
import ENSReverseResolution from '@/component/manage-ens/ENSReverseResolution'
import btnstyles from '@styles/Profile-Link.module.scss'
import ENSSidebar from '@/component/manage-ens/ENSSidebar'
import ENSTransfer from '@/component/manage-ens/ENSTransfer'
import ToastMessage from '@/component/toast-message'
import { BlockchainNetwork } from '@/component/web3/enum/blockchain-network.enum'
import { Cookie_Key } from '@/core/enum/cookie.enum'
import { TOAST_TYPE } from '@/core/enum/toast-type.enum'
import { handleConnectWallet, handleDomainOwnerDetails } from '@/helpers/ens'
import { validateDomain } from '@/helpers/parked-domains'
import Layout from '@/template/layout'
import RegistryModal from './registry-modal'
import { useAccount, useDisconnect } from 'wagmi'
import WalletConnectModal from './WalletConnectModal'
import { getCookieValue, setCookieValue } from '@/core/services/cookies.service'
import { useAppKitProvider } from '@reown/appkit/react'
import getNetworkConfig from '@/component/web3/ReturnNetworkId'
import { ExternalProvider } from '@ethersproject/providers'
import { useProviderReady } from '@/lib/useProviderReady'
import providerManager from '@/lib/provider-manager'
import { useProviderReadyInitial } from 'pages/Initial'
const ManageENSPage = () => {
  const meta = {
    title: 'Manage your ENS Domain',
    description: 'Manage your ENS Domain',
  }

  const router = useRouter()
  const { address, isConnected, chain } = useAccount()
  const { initialized } = useProviderReady()
  const provider = initialized ? providerManager.getWeb3Provider() : null
  const { disconnect } = useDisconnect()
  const [domain, setDomain] = useState('')
  const [domainOwnerAddress, setDomainOwnerAddress] = useState('')
  const [domainExpireDate, setDomainExpireDate] = useState('')
  const [domainResolver, setDomainResolver] = useState('')
  const [error, setError] = useState<string>()
  const { walletProvider } = useAppKitProvider('eip155')
  const [selectedMenu, setSelectedMenu] = useState<'profile' | 'crypto' | 'transfer' | 'pd' | 'reverse'>('profile')
  const [isOwner, setIsOwner] = useState(false)
  const [isWalletConnectedSet, setIsWalletConnectedSet] = useState(false)
  const [_isResolved, setIsResolved] = useState(false)
  const [switchError, setSwitchError] = useState<'pending' | 'err' | 'no_err'>('no_err')
  const [showResolverModal, setShowResolverModal] = useState(false)
  const [resolverError, setResolverError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasSwitchedNetwork, setHasSwitchedNetwork] = useState(false)
  const registredWalletADdress = getCookieValue(Cookie_Key.MANAGE_WALLET_ADDRESS)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const connectToWallet = () => toggleModal()
  const closeModel = () => setIsModalOpen(false)
  const { reinitialize } = useProviderReadyInitial()

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
    if (domainName.endsWith('.eth')) {
      setDomain(domainName)
      const data = await handleDomainOwnerDetails(domainName)
      if (data.error && data.resolverError) {
        setDomainResolver('')
        setShowResolverModal(true)
      }

      if (data.error) {
        console.error(data.error)
        setIsResolved(true)
        return
      }
      if (!data) {
        ToastMessage(TOAST_TYPE.ERROR, '', "Couldn't find the domain details")
        setError("Couldn't find the domain details")
        setIsResolved(true)
        return
      }

      if (data.isOwner) {
        setIsOwner(true)
      }
      if (data.expiry && typeof data.expiry === 'number') {
        const date = new Date(0)
        date.setUTCSeconds(data.expiry)
        setDomainExpireDate(date.toString())
      }

      if (data.ownerAddress) {
        setDomainOwnerAddress(data.ownerAddress)
      }

      if (data.resolver) {
        setDomainResolver(data.resolver)
      } else {
        setDomainResolver('')
        setShowResolverModal(true)
        return
      }
      setError('')
      setIsResolved(true)
    }
  }

  const handleWalletConnected = async (domainName: string) => {
    const isWalletConnectedNew = await isWalletConnected()
    setIsWalletConnectedSet(isWalletConnectedNew)
    if (!isWalletConnectedNew) return

    try {
      if (!hasSwitchedNetwork) {
        setSwitchError('pending')
        await handleSwitchNetwork(BlockchainNetwork.ETHEREUM)
        setSwitchError('no_err')
        setHasSwitchedNetwork(true)
      }
    } catch (err: any) {
      setSwitchError('err')
      setError(err?.message)
      ToastMessage(TOAST_TYPE.ERROR, '', err?.message)
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
    const isValid = validateDomain('ens', domain as string)
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
      console.log('✅ Provider ready')
    }
  }, [walletProvider, disconnect, initialized])

  const handleSwitchNetwork = async (BlockchainNetworkType: any) => {
    try {
      const { networkId } = getNetworkConfig(BlockchainNetworkType)
      const activeProvider = (walletProvider || provider?.provider) as ExternalProvider
      if (!activeProvider?.request) throw new Error('No wallet provider available')
      await activeProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(networkId).toString(16)}` }],
      })

      ToastMessage(TOAST_TYPE.SUCCESS, '', 'Network switched successfully.')
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        ToastMessage(TOAST_TYPE.ERROR, '', 'Network not available in MetaMask.')
      } else {
        ToastMessage(TOAST_TYPE.ERROR, '', 'Please switch to the correct network.')
      }
    }
  }
  // 🚀 Mobile timeout logic for forcing page reload
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

  const onCloseModal = () => {
    setIsOwner(false)
    setShowResolverModal(false)
    setIsResolved(true)
    setError('Need to add domain resolver to proceed.')
    setResolverError(true)
  }

  const addResolver = () => {
    setResolverError(false)
    connectToWallet()
  }

  if (!_isResolved || showResolverModal)
    return (
      <>
        <RegistryModal
          showResolverModal={showResolverModal}
          setShowResolverModal={setShowResolverModal}
          onCloseModal={onCloseModal}
          domain={domain}
          addResolver={addResolver}
        />

        <Layout metaInfo={meta}>
          <section className="py-5">
            <div className="container">
              <h1>Manage ENS</h1>
              <p>Loading domain details </p>
              <p className="text-center alert alert-warning">
                If you are stuck on loading, we suggest you log out and log in again with your wallet.
              </p>
              <ImSpinner9 className="spinner" style={{ border: 0 }} />
            </div>
          </section>
        </Layout>
      </>
    )

  if (error && switchError === 'err')
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage ENS</h1>

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
            <h1>Manage ENS</h1>
            <p>{error}</p>
          </div>
        </section>
      </Layout>
    )

  if (error && resolverError)
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage ENS</h1>
            <p>{error}</p>
            {resolverError && (
              <Button color="primary" onClick={addResolver}>
                Add Resolver
              </Button>
            )}
          </div>
        </section>
      </Layout>
    )

  if (error)
    return (
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className="container">
            <h1>Manage ENS</h1>
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
            <h1>Manage ENS</h1>
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
    <>
      <Layout metaInfo={meta}>
        <section className="py-5">
          <div className={`container ${btnstyles.sidenav_item} mx-auto`}>
         <div className="container">
           <h1>Manage your ENS Domain</h1>
          <hr />
         </div>
            <div className='d-flex justify-content-end flex-wrap flex-column flex-lg-row'>
              <ENSDomainDetails domain={domain} owner={domainOwnerAddress} expiry={domainExpireDate} resolver={domainResolver} />
            <ENSSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}>
              {isOwner ? (
                <>
                  {selectedMenu === 'reverse' && <ENSReverseResolution domain={domain} />}
                  {selectedMenu === 'profile' && <ENSProfile domain={domain} />}
                  {selectedMenu === 'crypto' && <ENSCrypto domain={domain} />}
                  {selectedMenu === 'transfer' && <ENSTransfer domain={domain} />}
                  {selectedMenu === 'pd' && <ParkedDomains domain={domain} provider="ens" />}
                </>
              ) : (
                <>
                  <h3> Sorry, you cannot manage this domain as you are not the owner</h3>
                  <h3> Please connect the wallet that owns this domain</h3>
                </>
              )}
            </ENSSidebar>
            </div>
          </div>
        </section>
      </Layout>
    </>
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

export default ManageENSPage
