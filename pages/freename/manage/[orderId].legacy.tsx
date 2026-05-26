import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/template/layout'
import { Spinner } from 'reactstrap'
import dynamic from 'next/dynamic'
import btnstyles from '@styles/Profile-Link.module.scss'

import FreenameSidebar from '@/component/freename/FreenameSidebar'
import DomainRecordsManager from '@/component/freename/DomainRecordsManager'
import DomainTokensManager from '@/component/freename/DomainTokensManager'

import { fetchDomainRecords } from '@/core/services/api.service'

/* ================= TYPES ================= */

interface DomainRecord {
  id: string | number
  recordUuid: string
  type: string
  name: string
  value: string
  ttl: number
}

interface DomainData {
  id: string
  order_id: string
  name?: string
  lifecycleStatus: string
  freenameZoneUuid: string
  firstRecordUuid: string
  records: DomainRecord[]
}

/* ================= COMPONENT ================= */

const FreenameDomainPage = () => {
  const router = useRouter()

  const orderIdParam = router.query.orderId
  const orderId = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam

  const [selectedMenu, setSelectedMenu] = useState<'records' | 'token' | 'transfer'>('records')
  const [domainData, setDomainData] = useState<DomainData | null>(null)
  const [loading, setLoading] = useState(true)

  const meta = {
    title: 'Freename Domain Records',
    description: 'Manage Freename Domain Records',
  }

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!router.isReady || !orderId) return

    const getDomainDetails = async () => {
      try {
        setLoading(true)

        const data = await fetchDomainRecords(orderId)

        if (data) {
          setDomainData(data)
        }
      } catch (err) {
        console.error('Error fetching records:', err)
      } finally {
        setLoading(false)
      }
    }

    getDomainDetails()
  }, [router.isReady, orderId])

  /* ================= STATES ================= */

  if (!router.isReady) return null

  return (
    <Layout metaInfo={meta}>
      <section className="py-5">
        <div className={`container ${btnstyles.sidenav_item_freename} mx-auto`}>
          {/* HEADER */}
          <div className="mb-3">
            <h1 className="fw-bold">Manage Freename Domain</h1>
            <p className="text-muted small">Configure your domain records, tokens and settings</p>
          </div>

          <hr />

          {/* LOADING */}
          {loading && (
            <div className="text-center my-5">
              <Spinner />
            </div>
          )}

          {/* CONTENT */}
          {!loading && domainData && (
            <div className="row">
              <FreenameSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu}>
                {selectedMenu === 'records' && <DomainRecordsManager domainData={domainData} orderId={orderId as string} />}

                {selectedMenu === 'token' && <DomainTokensManager domainData={domainData} />}

                {selectedMenu === 'transfer' && (
                  <div className="p-4 rounded bg-white shadow-sm">
                    <h5>Transfer Domain</h5>
                    <span className='text-muted'>Coming Soon...</span>
                  </div>
                )}
              </FreenameSidebar>
            </div>
          )}

          {/* NO DATA */}
          {!loading && !domainData && (
            <div className="text-center mt-5">
              <h4>No Domain Found</h4>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(FreenameDomainPage), {
  ssr: false,
})
