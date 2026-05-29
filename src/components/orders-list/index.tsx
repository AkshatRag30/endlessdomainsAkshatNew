import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ImSpinner9 } from 'react-icons/im'
import { Button, ButtonGroup, Modal, ModalBody, ModalHeader, Nav, Table } from 'reactstrap'

import { TOAST_TYPE } from '@/core/enum/toast-type.enum'

import { Cookie_Key } from '../../core/enum/cookie.enum'
import { ORDER_STATUS } from '../../core/enum/order-status.enum'
import { Order } from '../../core/model/order.type'
import { deleteOrder, getOrder } from '../../core/services/cart.service'
import { setCookieValue } from '../../core/services/cookies.service'
import OrderDetailTableRow from '../../template/order-detail-table-row'
import TransactionsListTable from '../../template/transactions-list-table'
import ToastMessage from '../toast-message'

import styles from 'styles/Transactions.module.scss'

const TransactionsList = () => {
  const ROUTER = useRouter()
  const [activeTab, setactiveTab] = useState(ORDER_STATUS.ALL)
  const [domainListInfo, setDomainListInfo] = useState<Order>()
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [confirmModalContent, setConfirmModalContent] = useState<any>(null)
  const toggleConfirmModal = () => setOpenConfirmModal(!openConfirmModal)

  const [orderCancelling, setOrderCancelling] = useState({
    id: '',
    cancelling: false,
  })

  const getOrderList = async () => {
    switch (activeTab) {
      case ORDER_STATUS.ALL: {
        const response = await getOrder(ORDER_STATUS.ALL, 100)

        if (response) {
          setDomainListInfo(response)
        }
        break
      }
      case ORDER_STATUS.COMPLETED: {
        const response = await getOrder(ORDER_STATUS.COMPLETED, 100)
        if (response) {
          setDomainListInfo(response)
        }
        break
      }
      case ORDER_STATUS.PROCESSING: {
        const response = await getOrder(ORDER_STATUS.PROCESSING, 100)
        if (response) {
          setDomainListInfo(response)
        }
        break
      }
    }
  }

  const confirmPayment = () => {
    console.log(confirmModalContent, 'confirmModalContent')
    if (confirmModalContent) {
      /*    if (confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider?.toLowerCase() === 'ens') {
        ROUTER.push(`/ens/register?orderId=${confirmModalContent.id}`)
      } else  */
      console.log(
        confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider?.toLowerCase() === 'solana',
        'confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider',
      )
      if (confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider?.toLowerCase() === 'arbitrum') {
        ROUTER.push(`/arb/register?orderId=${confirmModalContent.id}`)
      } else if (confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider?.toLowerCase() === 'binancesmartchain') {
        ROUTER.push(`/bnb/register?orderId=${confirmModalContent.id}`)
      } else if (confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider?.toLowerCase() === 'solana') {
        ROUTER.push(`/bonfida/bonfida-register?orderId=${confirmModalContent.id}`)
      } else {
        setCookieValue(Cookie_Key.ORDER_ID, confirmModalContent.id)
        ROUTER.push('/payment')
      }
    }
  }

  const cancelOrder = async (orderId: string) => {
    setOrderCancelling({
      cancelling: true,
      id: orderId,
    })
    try {
      const response = await deleteOrder(orderId)
      if (response.message) {
        getOrderList()
        setOpenConfirmModal(false)
        ToastMessage(TOAST_TYPE.SUCCESS, '', response.message)
        setOrderCancelling({
          cancelling: false,
          id: '',
        })
      }
    } catch (err) {
      ToastMessage(TOAST_TYPE.ERROR, '', typeof err === 'string' ? err : 'Unable to delete order')
      setOpenConfirmModal(false)
      setOrderCancelling({
        cancelling: false,
        id: '',
      })
      getOrderList()
    }

    return
  }

  useEffect(() => {
    getOrderList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  return (
    <>
      <Nav tabs className={`${styles.transaction_tab}`}>
        <ButtonGroup>
          <Button
            className={`${activeTab === ORDER_STATUS.ALL && styles.active}`}
            onClick={() => {
              setactiveTab(ORDER_STATUS.ALL)
            }}
          >
            All
          </Button>
          <Button
            className={`${activeTab === ORDER_STATUS.PROCESSING && styles.active}`}
            onClick={() => {
              setactiveTab(ORDER_STATUS.PROCESSING)
            }}
          >
            Processing
          </Button>
          <Button
            className={`${activeTab === ORDER_STATUS.COMPLETED && styles.active}`}
            onClick={() => {
              setactiveTab(ORDER_STATUS.COMPLETED)
            }}
          >
            Completed
          </Button>
        </ButtonGroup>
      </Nav>

      {/* <TabContent activeTab={activeTab}>
        <TabPane tabId={ORDER_STATUS.ALL}>
          <TransactionsListTable domainList={domainList1} />
        </TabPane>
        <TabPane tabId={ORDER_STATUS.PENDING}>
          <TransactionsListTable domainList={domainList2} />
        </TabPane>
        <TabPane tabId={ORDER_STATUS.COMPLETED}>
          <TransactionsListTable domainList={domainList3} />
        </TabPane>
      </TabContent> */}
      {domainListInfo && (
        <TransactionsListTable
          domainList={domainListInfo}
          setConfirmModalContent={setConfirmModalContent}
          setOpenConfirmModal={setOpenConfirmModal}
        />
      )}

      <Modal isOpen={openConfirmModal} toggle={toggleConfirmModal} className={`${styles.payment_modal}`} centered={true} size="lg">
        <ModalHeader toggle={toggleConfirmModal}>
          <b>Order Detail</b>
        </ModalHeader>
        <ModalBody>
          <p className="subtitle">Below are the list of domains purchased during this order.</p>
          <Table hover responsive className={styles.table}>
            <thead>
              <tr>
                <th>Domain</th>
                {/* <th>Transaction ID</th> */}
                <th>Mint Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {confirmModalContent &&
                confirmModalContent.domainDetailDtoList.length > 0 &&
                confirmModalContent.domainDetailDtoList.map((domains: any, index: number) => {
                  return <OrderDetailTableRow domains={domains} index={index} status={confirmModalContent.orderStatus} key={index} />
                })}
              {confirmModalContent && confirmModalContent.domainDetailDtoList.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    No Orders Found!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {/* {previousOrder &&
            previousOrder.result.domainDetailDtoList.map((order: any) => {
              return (
                <>
                  <Row>
                    <Col xs={6}>{order.domainName}</Col>
                    <Col xs={6} className="text-end">
                      $ {order.price}
                    </Col>
                  </Row>
                </>
              );
            })} */}
          {confirmModalContent &&
            (confirmModalContent.orderStatus === ORDER_STATUS.PENDING ||
              (confirmModalContent.orderStatus === ORDER_STATUS.PROCESSING &&
                ['Arbitrum', 'BinanceSmartChain'].includes(confirmModalContent?.domainDetailDtoList?.[0]?.domainProvider))) && (
              <div className="d-md-flex justify-content-end">
                {confirmModalContent.orderStatus === ORDER_STATUS.PENDING ? (
                  <Button
                    color="secondary"
                    className={`${styles.checkout_btn} mt-3 me-4`}
                    onClick={() => cancelOrder(confirmModalContent.id)}
                    disabled={orderCancelling.cancelling && orderCancelling.id === confirmModalContent.id}
                  >
                    {orderCancelling.cancelling && orderCancelling.id === confirmModalContent.id && <ImSpinner9 className="spinner me-2" />}{' '}
                    Cancel Order
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  color="primary"
                  className={`${styles.checkout_btn} mt-3`}
                  onClick={() => confirmPayment()}
                  disabled={orderCancelling.cancelling && orderCancelling.id === confirmModalContent.id}
                >
                  Continue Payment
                </Button>
              </div>
            )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default TransactionsList
