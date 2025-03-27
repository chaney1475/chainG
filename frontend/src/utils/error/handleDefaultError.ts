// handleDefaultError.ts
import { setErrorModal } from '@/store/slices/errorModalSlice'
import { store } from '@/store/store'

export const handleDefaultError = (error: any) => {
  if (!error.response?.data?.success) {
    store.dispatch(
      setErrorModal({
        modalTitle: '',
        modalContent: error.response?.data?.data?.message,
        primaryButtonType: 'confirm',
        secondaryButtonType: null,
        isVisible: true,
      }),
    )
    return Promise.reject(error)
  }

  const status = error.response?.status

  switch (status) {
    case 400:
    case 401:
    case 404:
    case 500:
    case 999:
      store.dispatch(
        setErrorModal({
          modalTitle: `error.${status}.title`,
          modalContent: `error.${status}.content`,
          primaryButtonType: 'confirm',
          secondaryButtonType: 'goToHome',
          isVisible: true,
        }),
      )
      break
    default:
      break
  }
  return Promise.reject(error)
}
