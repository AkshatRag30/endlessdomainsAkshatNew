import { BsCircleFill } from 'react-icons/bs'
import { Button } from 'reactstrap'

import styles from 'styles/My-Domains.module.scss'

const OrderItem = ({ orderItemInfo, setConfirmModalContent, setOpenConfirmModal, sno }: any) => {
  return (
    <tr>
      <td>{sno + 1}</td>
      <td>{orderItemInfo.id}</td>
      <td className={`text-capitalize ${styles.status}`} data-attribute={orderItemInfo.orderStatus.toLowerCase()}>
        <BsCircleFill size={12} className="me-2" />
        {orderItemInfo.orderStatus}
      </td>
      <td>{new Date(orderItemInfo.createdDateTime).toISOString().split('T')[0]}</td>
      <td>
        <span className="notranslate">$</span>{' '}
        {orderItemInfo.domainDetailDtoList?.[0]?.domainProvider === 'UD' ||
          orderItemInfo.domainDetailDtoList?.[0]?.domainProvider === 'Arbitrum' ||
          orderItemInfo.domainDetailDtoList?.[0]?.domainProvider === 'BinanceSmartChain' ||
          orderItemInfo.domainDetailDtoList?.[0]?.domainProvider === 'ENS' ||
          orderItemInfo.domainDetailDtoList?.[0]?.domainProvider === 'Bonfida' ||
          orderItemInfo.domainDetailDtoList?.[0]?.domainProvider === 'Freename'
          ? orderItemInfo.totalCost / 100
          : orderItemInfo.totalCost}
      </td>
      <td className="text-center">
        <span className="notranslate">$</span> {orderItemInfo.txnFee || '0.00'}
      </td>
      <td>
        <Button
          outline
          className={`${styles.manage_button}`}
          onClick={() => {
            setOpenConfirmModal(true)
            setConfirmModalContent(orderItemInfo)
          }}
        >
          View
        </Button>
        {/* <Button outline className={`${styles.delete_button}`}>
          Delete
        </Button> */}
      </td>
    </tr>
  )
}

export default OrderItem
