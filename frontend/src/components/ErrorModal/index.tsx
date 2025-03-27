/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import * as Dialog from '@radix-ui/react-dialog'

import { setErrorModalVisible } from '@/store/slices/errorModalSlice'
import { RootState } from '@/store/store'

import { ConfirmButton } from '../ConfirmButton'
import {
  ButtonWrapper,
  contentStyle,
  descStyle,
  overlayStyle,
  titleStyle,
} from '../Modal/styles'

export default function ErrorModal() {
  const { t } = useTranslation()
  const {
    isVisible,
    modalTitle,
    modalContent,
    primaryButtonType,
    secondaryButtonType,
  } = useSelector((state: RootState) => state.errorModal)
  const dispatch = useDispatch()

  if (!isVisible) return null

  return (
    <Dialog.Root
      open={isVisible}
      onOpenChange={() => dispatch(setErrorModalVisible(false))}>
      <Dialog.Portal>
        <Dialog.Overlay css={overlayStyle} />
        <Dialog.Content css={contentStyle}>
          <Dialog.Title css={titleStyle}>
            {t(modalTitle?.toString() ?? '')}
          </Dialog.Title>
          {modalContent && (
            <Dialog.Description css={descStyle}>
              {t(modalContent?.toString() ?? '')}
            </Dialog.Description>
          )}
          <ButtonWrapper>
            {secondaryButtonType && (
              <ConfirmButton
                label={t(secondaryButtonType)}
                variant={'prev'}
                onClick={() => dispatch(setErrorModalVisible(false))}
              />
            )}
            {primaryButtonType && (
              <ConfirmButton
                label={t(primaryButtonType)}
                variant={'next'}
                onClick={() => dispatch(setErrorModalVisible(false))}
              />
            )}
          </ButtonWrapper>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
