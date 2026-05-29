import { Table } from 'reactstrap'

import OrderItem from '../../component/order-item'

import styles from 'styles/Transactions.module.scss'

const TransactionsListTable = ({
  domainList,
  setConfirmModalContent,
  setOpenConfirmModal,
}: {
  domainList: any
  setConfirmModalContent: any
  setOpenConfirmModal: any
}) => {
  return (
    <>
      <section className={`${styles.table}`}>
        <Table hover responsive>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Order ID</th>
              <th>Status</th>
              <th>Transaction date</th>
              <th>Amount</th>

              <th>Registration fees</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {domainList &&
              domainList.data.length > 0 &&
              domainList.data.map((domains: any, index: number) => {
                return (
                  <OrderItem
                    orderItemInfo={domains}
                    key={index}
                    setConfirmModalContent={setConfirmModalContent}
                    setOpenConfirmModal={setOpenConfirmModal}
                    sno={index}
                  />
                )
              })}
            {domainList && domainList.data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No Orders Found!
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </section>
    </>
  )
}

export default TransactionsListTable
