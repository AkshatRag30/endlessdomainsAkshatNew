import React, { useState, useCallback, useId } from 'react'
import { FiEdit2, FiX, FiArrowRight } from 'react-icons/fi'
import { TbFileText, TbSquarePlus } from 'react-icons/tb'
import { BsCheck2 } from 'react-icons/bs'
import { MdArrowForward } from 'react-icons/md'

import { PrimaryButton } from '@/design-system/primitives/button'
import type { DnsRecord } from './types'
import styles from './FreenameRecords.module.scss'

const DEMO_RECORDS: DnsRecord[] = [
  { id: '1', type: 'A',     host: 'Akshat',   content: '192.168.1.1',                           ttl: 3600 },
  { id: '2', type: 'CNAME', host: 'Akshat',   content: 'mysite.x',                              ttl: 3600 },
  { id: '3', type: 'MX',    host: 'Akshat',   content: 'mail.mysite.x',                         ttl: 3600 },
  { id: '4', type: 'TXT',   host: 'Akshat',   content: 'v=spf1 include:_spf.google.com ~all',   ttl: 300  },
]

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA']

const EMPTY_FORM = { type: 'A', host: '', content: '', ttl: 3600 }

interface RecordFormState {
  type: string
  host: string
  content: string
  ttl: number
}

// ── Success modal ─────────────────────────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Save successful"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FiX size={18} aria-hidden="true" />
        </button>
        <div className={styles.iconWrap}>
          <div className={styles.iconOuter}>
            <div className={styles.iconInner}>
              <BsCheck2 className={styles.checkIcon} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.iconShadow} aria-hidden="true" />
        </div>
        <div className={styles.modalText}>
          <p className={styles.modalTitle}>Save Change Successful</p>
          <p className={styles.modalSubtitle}>
            Your DNS records have been updated successfully.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Create / Edit record modal ─────────────────────────────────────────────────

interface RecordModalProps {
  initialValues?: DnsRecord
  onSave: (values: RecordFormState) => void
  onClose: () => void
  formId: string
}

function RecordModal({ initialValues, onSave, onClose, formId }: RecordModalProps) {
  const [form, setForm] = useState<RecordFormState>(
    initialValues
      ? { type: initialValues.type, host: initialValues.host, content: initialValues.content, ttl: initialValues.ttl }
      : EMPTY_FORM
  )

  const isEdit    = Boolean(initialValues)
  const typeId    = `${formId}-type`
  const hostId    = `${formId}-host`
  const contentId = `${formId}-content`
  const ttlId     = `${formId}-ttl`

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!form.host.trim() || !form.content.trim()) return
    onSave(form)
  }, [form, onSave])

  return (
    <div
      className={styles.recordOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit record' : 'Create record'}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.recordModal}>
        {/* Header */}
        <div className={styles.recordModalHeader}>
          <span className={styles.recordModalTitle}>
            {isEdit ? 'Edit Record' : 'Create Records'}
          </span>
          <button
            type="button"
            className={styles.recordModalClose}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.recordModalDivider} aria-hidden="true" />

        {/* Form */}
        <form
          id={formId}
          className={styles.recordModalForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.recordModalField}>
            <label htmlFor={typeId} className={styles.recordModalLabel}>Select Type</label>
            <select
              id={typeId}
              className={styles.recordModalSelect}
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
            >
              {DNS_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className={styles.recordModalField}>
            <label htmlFor={hostId} className={styles.recordModalLabel}>Name</label>
            <input
              id={hostId}
              type="text"
              className={styles.recordModalInput}
              value={form.host}
              onChange={e => setForm(prev => ({ ...prev, host: e.target.value }))}
              placeholder="@ or subdomain"
              required
            />
          </div>

          <div className={styles.recordModalField}>
            <label htmlFor={contentId} className={styles.recordModalLabel}>Value</label>
            <input
              id={contentId}
              type="text"
              className={styles.recordModalInput}
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write Value"
              required
            />
          </div>

          <div className={styles.recordModalField}>
            <label htmlFor={ttlId} className={styles.recordModalLabel}>TTL</label>
            <input
              id={ttlId}
              type="number"
              className={styles.recordModalInput}
              value={form.ttl}
              onChange={e => setForm(prev => ({ ...prev, ttl: Number(e.target.value) }))}
              min={60}
              placeholder="3600"
            />
          </div>

          <button type="submit" className={styles.recordModalSubmit}>
            {isEdit ? 'Update' : 'Create'}
            <MdArrowForward size={16} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface FreenameRecordsProps {
  orderId: string
}

export function FreenameRecords({ orderId: _orderId }: FreenameRecordsProps) {
  const baseId = useId()
  const [records, setRecords]         = useState<DnsRecord[]>(DEMO_RECORDS)
  const [modalMode, setModalMode]     = useState<'add' | 'edit' | null>(null)
  const [editingRecord, setEditingRecord] = useState<DnsRecord | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const openAdd  = useCallback(() => { setEditingRecord(null); setModalMode('add') }, [])
  const openEdit = useCallback((record: DnsRecord) => { setEditingRecord(record); setModalMode('edit') }, [])
  const closeModal = useCallback(() => { setModalMode(null); setEditingRecord(null) }, [])

  const handleAdd = useCallback((values: RecordFormState) => {
    setRecords(prev => [...prev, { id: String(Date.now()), ...values }])
    closeModal()
  }, [closeModal])

  const handleUpdate = useCallback((id: string, values: RecordFormState) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...values } : r))
    closeModal()
  }, [closeModal])

  return (
    <section className={styles.section}>
      {/* ── Records header box ────────────────────────────────────────────── */}
      <div className={styles.recordsHeader}>
        <div className={styles.titleRow}>
          <TbFileText className={styles.titleIcon} aria-hidden="true" />
          <h2 className={styles.title}>Records</h2>
        </div>
        <p className={styles.subtitle}>
          Your primary Web3 identity is what apps and wallets display instead of your raw address.
        </p>
        <button
          type="button"
          className={styles.addRecordsBtn}
          onClick={openAdd}
        >
          <span className={styles.addRecordsBtnIcon} aria-hidden="true">
            <TbSquarePlus size={22} />
          </span>
          <span className={styles.addRecordsBtnLabel}>Add Records</span>
        </button>
      </div>

      {/* ── Records table ─────────────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        {records.length === 0 ? (
          <p className={styles.emptyState}>No records found. Add your first record below.</p>
        ) : (
          <table className={styles.table} aria-label="DNS records">
            <thead>
              <tr>
                <th className={styles.th} scope="col">Type</th>
                <th className={styles.th} scope="col">Name</th>
                <th className={`${styles.th} ${styles.thContent}`} scope="col">Value</th>
                <th className={styles.th} scope="col">TTL</th>
                <th className={`${styles.th} ${styles.thActions}`} scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} className={styles.tableRow}>
                  <td className={styles.td}>
                    <span className={styles.typeBadge}>{record.type}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.hostText}>{record.host}</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdContent}`}>
                    <span className={styles.contentText}>{record.content}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.ttlText}>{record.ttl}s</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdActions}`}>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => openEdit(record)}
                      aria-label={`Edit ${record.type} record for ${record.host}`}
                    >
                      <span className={styles.editLabel}>Edit</span>
                      <FiEdit2 size={13} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Bottom actions ─────────────────────────────────────────────────── */}
      <div className={styles.bottomActions}>
        <PrimaryButton
          className={styles.actionBtn}
          onClick={() => setShowSuccess(true)}
          icon={<FiArrowRight aria-hidden="true" />}
          iconPosition="right"
        >
          Save Changes
        </PrimaryButton>
      </div>

      {/* ── Create / Edit record modal ──────────────────────────────────────── */}
      {modalMode === 'add' && (
        <RecordModal
          formId={`${baseId}-add`}
          onSave={handleAdd}
          onClose={closeModal}
        />
      )}
      {modalMode === 'edit' && editingRecord && (
        <RecordModal
          formId={`${baseId}-edit-${editingRecord.id}`}
          initialValues={editingRecord}
          onSave={values => handleUpdate(editingRecord.id, values)}
          onClose={closeModal}
        />
      )}

      {/* ── Success modal ───────────────────────────────────────────────────── */}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </section>
  )
}

export default FreenameRecords
