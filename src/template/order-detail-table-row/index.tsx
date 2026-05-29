//import { useState } from 'react'
//import Link from 'next/link'
import { BsCircleFill } from 'react-icons/bs'

import { ORDER_STATUS } from '@/core/enum/order-status.enum'
//import { Tooltip } from 'reactstrap'

const OrderDetailTableRow = ({ domains, index, status }: any) => {
  // const [tooltipOpen, setTooltipOpen] = useState(false)
  // const toggle = () => setTooltipOpen(!tooltipOpen)
  return (
    <tr key={index}>
      <td>{domains.domainName}</td>
      {/* <td>
        {domains.domainMint[0].transactionId && (
          <>
            <Link className="subtitle" id={`walletAddress${index}`} target="_blank" href={domains.domainMint[0].blockchainExplorer}>
              {domains.domainMint[0].transactionId &&
                domains.domainMint[0].transactionId.substring(0, 10) +
                  '...' +
                  domains.domainMint[0].transactionId.substring(
                    domains.domainMint[0].transactionId.length - 10,
                    domains.domainMint[0].transactionId.length
                  )}
            </Link>
            <Tooltip isOpen={tooltipOpen} target={`walletAddress${index}`} toggle={toggle}>
              {domains.domainMint && domains.domainMint[0].transactionId}
            </Tooltip>
          </>
        )}
      </td> */}
      <td>
        {status === ORDER_STATUS.PROCESSING ? (
          <span style={{ color: '#2dbded' }}>
            <BsCircleFill size={12} className="me-2" />
            Processing
          </span>
        ) : (
          <span data-attribute={status.toLowerCase()}>
            <BsCircleFill size={12} className="me-2" />
            {status}
          </span>
        )}
      </td>
      <td>$ {domains.price}</td>
    </tr>
  )
}

export default OrderDetailTableRow
