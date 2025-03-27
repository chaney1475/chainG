/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

import * as Dialog from '@radix-ui/react-dialog'

import { ConfirmButton } from '../ConfirmButton'
import {
  ButtonWrapper,
  contentStyle,
  descStyle,
  overlayStyle,
  titleStyle,
} from './styles'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
}

export default function Modal({
  open,
  onOpenChange,
  onConfirm,
  title = '당번 삭제',
  description = '계약서를 임시저장할까요?\n계약서의 내용을 그룹원들이 서로 확인할 수 있어요.',
  confirmText = '확인',
}: ModalProps) {
  const { t } = useTranslation()
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay css={overlayStyle} />
        <Dialog.Content css={contentStyle}>
          <Dialog.Title css={titleStyle}>{title}</Dialog.Title>
          <Dialog.Description css={descStyle}>
            {description.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </Dialog.Description>
          <ButtonWrapper>
            <Dialog.Close asChild>
              <ConfirmButton
                label={t('cancel')}
                variant={'prev'}
              />
            </Dialog.Close>
            <ConfirmButton
              label={confirmText}
              variant={'next'}
              onClick={onConfirm}
            />
          </ButtonWrapper>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
