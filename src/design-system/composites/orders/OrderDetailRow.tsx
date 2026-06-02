import React from 'react'

import { type DomainDetail, type OrderStatus } from './ordersData'
import StatusBadge from './StatusBadge'

interface OrderDetailRowProps {
  domain: DomainDetail
  orderStatus: OrderStatus
}

const OrderDetailRow: React.FC<OrderDetailRowProps> = ({ domain, orderStatus }) => (
  <tr>
    <td>{domain.domainName}</td>
    <td>
      <StatusBadge status={orderStatus} />
    </td>
    <td>$ {domain.price}</td>
  </tr>
)

export default OrderDetailRow
