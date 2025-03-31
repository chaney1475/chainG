/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

import * as Dialog from '@radix-ui/react-dialog'

import { ConfirmButton } from '@/components/ConfirmButton'

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
  title = '생활규칙 수정 불가',
  description = '기존에 수정된 항목이 존재합니다\n승인 후에 수정할 수 있습니다',
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
