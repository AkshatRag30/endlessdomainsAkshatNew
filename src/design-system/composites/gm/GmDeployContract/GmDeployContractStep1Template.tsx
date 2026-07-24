import Image from 'next/image'
import { FiArrowRight } from 'react-icons/fi'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import templateIcon from '../../../../../public/gm/deploy-contract/template-icon.svg'
import { DEPLOY_CONTRACT_TEMPLATES, DeployContractTemplateId } from './gmDeployContract.data'
import styles from './GmDeployContractStep1Template.module.scss'

interface GmDeployContractStep1TemplateProps {
  selectedId: DeployContractTemplateId | null
  onSelect: (id: DeployContractTemplateId, comingSoon?: boolean) => void
  onContinue: () => void
}

export function GmDeployContractStep1Template({ selectedId, onSelect, onContinue }: GmDeployContractStep1TemplateProps) {
  return (
    <div className={styles.step}>

      <div className={styles.templateGrid} role="radiogroup" aria-label="Contract template">
        {DEPLOY_CONTRACT_TEMPLATES.map(template => {
          const isSelected = selectedId === template.id
          return (
            <div
              key={template.id}
              className={`${styles.templateCardWrap} ${isSelected ? styles.templateCardWrapSelected : ''} ${template.comingSoon ? styles.templateCardWrapDisabled : ''}`}
            >
              <div className={styles.templateCardHalo} aria-hidden="true" />

              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={template.comingSoon}
                className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ''} ${template.comingSoon ? styles.templateCardDisabled : ''}`}
                onClick={() => onSelect(template.id, template.comingSoon)}
              >
                {template.comingSoon && (
                  <span className={styles.comingSoonBadge}>Coming Soon</span>
                )}

                <div className={styles.templateHeader}>
                  <span className={styles.iconCircle}>
                    <Image src={templateIcon} alt="" width={21} height={21} className={styles.icon} />
                  </span>
                  <h3 className={styles.templateTitle}>
                    {template.title}
                  </h3>
                </div>

                <p className={styles.templateDescription}>{template.description}</p>
              </button>
            </div>
          )
        })}
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.actions}>
        <PrimaryButton
          type="button"
          shape="octagon"
          onClick={onContinue}
          disabled={!selectedId}
          icon={<FiArrowRight size={18} />}
          iconPosition="right"
        >
          Continue
        </PrimaryButton>
      </div>

    </div>
  )
}

export default GmDeployContractStep1Template
