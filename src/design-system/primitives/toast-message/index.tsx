import React from 'react'
import { toast } from 'react-toastify'

import { TOAST_TYPE } from '@/core/enum/toast-type.enum'

import ToastErrorMessage from './error'
import ToastInfoMessage from './info-primary'
import ToastInfoSuccessMessage from './info-success'
import ToastPrimaryMessage from './primary'
import ToastSecondaryMessage from './secondary'
import ToastSuccessMessage from './success'
import ToastWarningMessage from './warning'

// items: optional bullet-list entries, used by the ERROR variant
const ToastMessage = (type: string, title = '', message: string, items?: string[]) => {
  if (type === TOAST_TYPE.PRIMARY) {
    return toast(<ToastPrimaryMessage title={title} message={message} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }
  if (type === TOAST_TYPE.SECONDARY) {
    return toast(<ToastSecondaryMessage title={title} message={message} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }
  if (type === TOAST_TYPE.ERROR) {
    return toast(<ToastErrorMessage title={title} message={message} items={items} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }
  if (type === TOAST_TYPE.WARNING) {
    return toast(<ToastWarningMessage title={title} message={message} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }
  if (type === TOAST_TYPE.SUCCESS) {
    // closeToast is injected by react-toastify into the custom component
    return toast((props: any) => <ToastSuccessMessage message={message} closeToast={props.closeToast} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }
  if (type === TOAST_TYPE.INFO) {
    return toast((props: any) => <ToastInfoMessage message={message} closeToast={props.closeToast} />, {
      position: (typeof window !== 'undefined' ? window.innerWidth : 0) > 600 ? toast.POSITION.BOTTOM_LEFT : toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }
  if (type === TOAST_TYPE.INFO_SUCCESS) {
    return toast(<ToastInfoSuccessMessage title={title} message={message} />, {
      position: (typeof window !== 'undefined' ? window.innerWidth : 0) > 600 ? toast.POSITION.BOTTOM_LEFT : toast.POSITION.BOTTOM_RIGHT,
      closeButton: false,
    })
  }

  return null
}

export default ToastMessage
