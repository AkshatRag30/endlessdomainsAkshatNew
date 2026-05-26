import { useState, useEffect } from 'react'
import { Button, Table, Spinner, UncontrolledTooltip } from 'reactstrap'
import { createDomainRecord, updateDomainRecord, fetchDomainRecords } from '@/core/services/api.service'
import { MdContentCopy } from 'react-icons/md'
import btnstyles from '@styles/Profile-Link.module.scss'
import { Col, Row } from 'reactstrap'
import { getDomainProvider } from '@/helpers/chaincurrency/chaincurrency'
import Image from 'next/image'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
/* ================= TYPES ================= */

interface DomainRecord {
  id: string | number
  recordUuid: string
  type: string
  name: string
  value: string
  ttl: number
}

interface RegistrantProfile {
  name?: string | null
  email?: string | null
  phone?: string | null
  city?: string | null
  country?: string | null
  organization?: string | null
  walletAddress?: string | null
}

interface DomainData {
  id: string
  order_id: string
  name?: string | null
  lifecycleStatus: string
  freenameZoneUuid: string
  firstRecordUuid: string
  records: DomainRecord[]
  registrant?: RegistrantProfile | null
}

interface Props {
  domainData: DomainData
  orderId: string
}

/* ================= COMPONENT ================= */

const DomainRecordsManager = ({ domainData, orderId }: Props) => {
  const [records, setRecords] = useState<DomainRecord[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DomainRecord | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const [form, setForm] = useState({
    type: '',
    name: '',
    value: '',
    ttl: '3600',
  })

  useEffect(() => {
    setRecords(domainData.records || [])
  }, [domainData])

  const refreshRecords = async () => {
    try {
      setTableLoading(true)
      const data = await fetchDomainRecords(orderId)
      setRecords(data?.records || [])
    } finally {
      setTableLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'type') {
      setForm({ ...form, type: value, value: '' })
    } else {
      setForm({ ...form, [field]: value })
    }
  }

  const handleCreate = async () => {
    setActionLoading(true)
    await createDomainRecord(domainData.id, domainData.firstRecordUuid, {
      ...form,
      ttl: Number(form.ttl),
    })
    setShowCreateModal(false)
    await refreshRecords()
    setActionLoading(false)
  }

  const handleUpdate = async () => {
    if (!selectedRecord) return
    setActionLoading(true)

    await updateDomainRecord(selectedRecord.recordUuid, {
      name: form.name,
      value: form.value,
      ttl: Number(form.ttl),
    })

    setShowUpdateModal(false)
    await refreshRecords()
    setActionLoading(false)
  }

  const openUpdate = (record: DomainRecord) => {
    setSelectedRecord(record)

    setForm({
      type: record.type?.toUpperCase() || '',
      name: record.name || '',
      value: record.value || '',
      ttl: record.ttl ? String(record.ttl) : '',
    })

    setShowCreateModal(false)
    setShowUpdateModal(true)
  }

  const RECORD_TYPES_CONFIG = [
    { value: 'CNAME', label: 'CNAME', placeholder: 'Hostname', description: 'Alias domain' },
    { value: 'A', label: 'A', placeholder: 'IPv4 Address', description: 'Server IP' },
    { value: 'AAAA', label: 'AAAA', placeholder: 'IPv6 Address', description: 'IPv6 server' },
    { value: 'MX', label: 'MX', placeholder: 'Priority + Host', description: 'Mail server' },
    { value: 'TXT', label: 'TXT', placeholder: 'Text', description: 'Metadata / verification' },
  ]

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setShowUpdateModal(false)
    setSelectedRecord(null)
    setForm({ type: '', name: '', value: '', ttl: '3600' })
  }
  const handleCopy = async () => {
    if (!domainData?.registrant?.walletAddress) return
    await navigator.clipboard.writeText(domainData.registrant.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const getProvider = getDomainProvider('Freename')
  /* ================= UI ================= */

  return (
    <>
      <div className={btnstyles.sidenav_item_freename}>
        <h5 className=" fw-semibold">Domain Information</h5>

        <div>
          <h2
            style={{
              background: getProvider?.colorName,
              color: 'rgb(52, 65, 184)',
            }}
          >
            {domainData.name}
          </h2>
        </div>

        {/* CARDS */}
        <div className="row g-3">
          <Col lg={12}>
            <Row className="mt-3">
              <Col md={3}>
                <p className="fw-bold mb-0">Order ID: </p>
              </Col>
              <Col md={9}>
                <p className="fw-medium mb-0">{domainData.order_id}</p>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={3}>
                <p className="fw-bold mb-0">Provider: </p>
              </Col>
              <Col md={9}>
                <h3 className="mb-0">
                  {getProvider && <Image src={getProvider.image} alt={getProvider.label} width={24} height={24} />} {getProvider?.label}
                </h3>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={3}>
                <p className="fw-bold mb-0">Zone UUID: </p>
              </Col>
              <Col md={9}>
                <p className="text-break small text-muted mb-0">{domainData.freenameZoneUuid}</p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={3}>
                <p className="fw-bold mb-0">Wallet</p>
              </Col>
              <Col md={9}>
                <div className="d-flex align-items-center gap-2">
                  <span className={btnstyles.owner_txt}>{domainData?.registrant?.walletAddress || '-'}</span>

                  <span id="copy-wallet" onClick={handleCopy} style={{ cursor: 'pointer' }}>
                    <MdContentCopy />
                  </span>

                  <UncontrolledTooltip placement="top" target="copy-wallet">
                    {copied ? 'Copied!' : 'Copy'}
                  </UncontrolledTooltip>
                </div>
              </Col>
            </Row>
          </Col>
        </div>
      </div>
      {/* ACTION */}
      <div className={`mt-3 ${btnstyles.sidenav_item_freename}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className=" fw-semibold">Records</h5>
          <Button
            color="primary"
            onClick={() => {
              setForm({ type: '', name: '', value: '', ttl: '3600' })
              setSelectedRecord(null)
              setShowCreateModal(true)
            }}
          >
            + Add Record
          </Button>
        </div>
        <div className={`${btnstyles.custom_record_table} table-responsive mt-3`}>
          <Table className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Value</th>
                <th>TTL</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {tableLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <Spinner size="sm" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No records
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr key={r.id}>
                    {/* TYPE */}
                    <td>
                      <span
                        className={btnstyles.type_badge}
                        style={{
                          background: '#eef2ff',
                          color: '#4f46e5',
                        }}
                      >
                        {r.type}
                      </span>
                    </td>

                    {/* NAME */}
                    <td>
                      <div className={btnstyles.record_name}>{r.name}</div>
                    </td>

                    {/* VALUE */}
                    <td>
                      <span className={btnstyles.record_value}>
                        {r.value?.length > 30 ? `${r.value.slice(0, 10)}...${r.value.slice(-6)}` : r.value}
                      </span>
                    </td>

                    {/* TTL */}
                    <td>
                      <span className={btnstyles.ttl_badge}>{r.ttl}s</span>
                    </td>

                    {/* ACTION */}
                    <td>
                      <Button size="sm" className={btnstyles.edit_btn} onClick={() => openUpdate(r)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* CREATE / UPDATE MODAL */}
      <Modal
        isOpen={showCreateModal || showUpdateModal}
        toggle={() => {
          setShowCreateModal(false)
          setShowUpdateModal(false)
        }}
        centered
      >
        <ModalHeader
          toggle={() => {
            setShowCreateModal(false)
            setShowUpdateModal(false)
          }}
        >
          {showCreateModal ? 'Create Record' : 'Update Record'}
        </ModalHeader>

        <ModalBody>
          <select
            className="form-control mb-2"
            value={form.type}
            disabled={showUpdateModal}
            onChange={e => handleChange('type', e.target.value)}
          >
            <option value="">Select Type</option>
            {RECORD_TYPES_CONFIG.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {form.type && (
            <small className="text-muted d-block mb-3">{RECORD_TYPES_CONFIG.find(t => t.value === form.type)?.description}</small>
          )}

          <input className="form-control mb-3" placeholder="Name" value={form.name} onChange={e => handleChange('name', e.target.value)} />

          <input
            className="form-control mb-3"
            placeholder={RECORD_TYPES_CONFIG.find(t => t.value === form.type)?.placeholder || 'Value'}
            value={form.value}
            onChange={e => handleChange('value', e.target.value)}
          />

          {/* TTL */}
          <input className="form-control" placeholder="TTL" value={form.ttl} onChange={e => handleChange('ttl', e.target.value)} />
        </ModalBody>

        <ModalFooter>

          <Button
            color="primary"
            disabled={!form.name || !form.value || !form.ttl || actionLoading}
            onClick={showCreateModal ? handleCreate : handleUpdate}
          >
            {actionLoading ? <Spinner size="sm" /> : 'Save'}
          </Button>
        </ModalFooter>
      </Modal>
      <style jsx>{`
        :global(.btn-close) {
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

export default DomainRecordsManager
