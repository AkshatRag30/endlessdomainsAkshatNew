import React, { useState, useCallback, useId } from 'react'
import { TbFileText } from 'react-icons/tb'
import { FiPlus, FiEdit2, FiX, FiArrowRight, FiCheck } from 'react-icons/fi'
import { BsCheck2 } from 'react-icons/bs'

import { PrimaryButton } from '@/design-system/primitives/button'
import type { DnsRecord } from './types'
import styles from './FreenameRecords.module.scss'

// ── Demo data — replace with API response when integrating ──────────────────
// To integrate: call fetchDomainRecords(orderId) in parent, pass records as prop
// Expected API shape: DnsRecord[] (see types.ts)

const DEMO_RECORDS: DnsRecord[] = [
  { id: '1', type: 'A',     host: '@',   content: '192.168.1.1',                           ttl: 3600 },
  { id: '2', type: 'CNAME', host: 'www', content: 'mysite.x',                              ttl: 3600 },
  { id: '3', type: 'MX',    host: '@',   content: 'mail.mysite.x',                         ttl: 3600 },
  { id: '4', type: 'TXT',   host: '@',   content: 'v=spf1 include:_spf.google.com ~all',   ttl: 300  },
]

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA']

const EMPTY_FORM = { type: 'A', host: '', content: '', ttl: 3600 }

interface RecordFormState {
  type: string
  host: string
  content: string
  ttl: number
}

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

interface RecordFormProps {
  initialValues?: DnsRecord
  onSave: (values: RecordFormState) => void
  onCancel: () => void
  formId: string
}

function RecordForm({ initialValues, onSave, onCancel, formId }: RecordFormProps) {
  const [form, setForm] = useState<RecordFormState>(
    initialValues
      ? { type: initialValues.type, host: initialValues.host, content: initialValues.content, ttl: initialValues.ttl }
      : EMPTY_FORM
  )

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
    <form className={styles.form} onSubmit={handleSubmit} id={formId}>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor={typeId} className={styles.formLabel}>Type</label>
          <select
            id={typeId}
            className={styles.formSelect}
            value={form.type}
            onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
          >
            {DNS_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor={hostId} className={styles.formLabel}>Host</label>
          <input
            id={hostId}
            type="text"
            className={styles.formInput}
            value={form.host}
            onChange={e => setForm(prev => ({ ...prev, host: e.target.value }))}
            placeholder="@ or subdomain"
            required
          />
        </div>

        <div className={`${styles.formField} ${styles.formFieldContent}`}>
          <label htmlFor={contentId} className={styles.formLabel}>Content / Value</label>
          <input
            id={contentId}
            type="text"
            className={styles.formInput}
            value={form.content}
            onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter record value"
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={ttlId} className={styles.formLabel}>TTL (seconds)</label>
          <input
            id={ttlId}
            type="number"
            className={styles.formInput}
            value={form.ttl}
            onChange={e => setForm(prev => ({ ...prev, ttl: Number(e.target.value) }))}
            min={60}
            placeholder="3600"
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelFormBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveFormBtn}>
          <FiCheck size={16} aria-hidden="true" />
          {initialValues ? 'Update Record' : 'Add Record'}
        </button>
      </div>
    </form>
  )
}

interface FreenameRecordsProps {
  orderId: string
}

export function FreenameRecords({ orderId: _orderId }: FreenameRecordsProps) {
  const baseId = useId()
  const [records, setRecords]     = useState<DnsRecord[]>(DEMO_RECORDS)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAdd = useCallback((values: RecordFormState) => {
    setRecords(prev => [...prev, { id: String(Date.now()), ...values }])
    setShowAddForm(false)
  }, [])

  const handleUpdate = useCallback((id: string, values: RecordFormState) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...values } : r))
    setEditingId(null)
  }, [])


  return (
    <section className={styles.section}>
      <div className={styles.titleRow}>
        <TbFileText className={styles.titleIcon} aria-hidden="true" />
        <h2 className={styles.title}>DNS Records</h2>
      </div>
      <p className={styles.subtitle}>Manage your domain DNS records</p>

      {/* ── Records table ─────────────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        {records.length === 0 ? (
          <p className={styles.emptyState}>No records found. Add your first record below.</p>
        ) : (
          <table className={styles.table} aria-label="DNS records">
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.th} scope="col">Type</th>
                <th className={styles.th} scope="col">Name</th>
                <th className={`${styles.th} ${styles.thContent}`} scope="col">Value</th>
                <th className={styles.th} scope="col">TTL</th>
                <th className={`${styles.th} ${styles.thActions}`} scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                React.createElement(React.Fragment, { key: record.id },
                  <tr
                    className={[
                      styles.tableRow,
                      editingId === record.id ? styles.tableRowEditing : '',
                    ].filter(Boolean).join(' ')}
                  >
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
                        onClick={() => setEditingId(editingId === record.id ? null : record.id)}
                        aria-label={`Edit ${record.type} record for ${record.host}`}
                        aria-expanded={editingId === record.id}
                      >
                        <span className={styles.editLabel}>Edit</span>
                        <FiEdit2 size={13} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>,
                  editingId === record.id && (
                    <tr className={styles.editRow}>
                      <td colSpan={5} className={styles.editCell}>
                        <RecordForm
                          formId={`${baseId}-edit-${record.id}`}
                          initialValues={record}
                          onSave={values => handleUpdate(record.id, values)}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  )
                )
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add record form ────────────────────────────────────────────────── */}
      {showAddForm && (
        <div className={styles.addFormWrap}>
          <p className={styles.addFormTitle}>New Record</p>
          <RecordForm
            formId={`${baseId}-add`}
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* ── Bottom actions ─────────────────────────────────────────────────── */}
      <div className={styles.bottomActions}>
        {!showAddForm && (
          <button type="button" className={styles.addRecordBtn} onClick={() => setShowAddForm(true)}>
            <FiPlus size={18} aria-hidden="true" />
            Add Record
          </button>
        )}

        <PrimaryButton
          className={styles.actionBtn}
          onClick={() => setShowSuccess(true)}
          icon={<FiArrowRight aria-hidden="true" />}
          iconPosition="right"
        >
          Save Changes
        </PrimaryButton>
      </div>

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </section>
  )
}

export default FreenameRecords
