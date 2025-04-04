/** @jsxImportSource @emotion/react */
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
  children?: React.ReactNode
}

export function Modal({
  open,
  onOpenChange,
  onConfirm,
  title = '당번 삭제',
  description = '서약서를 임시저장할까요?\n서약서의 내용을 그룹원들이 서로 확인할 수 있어요.',
  confirmText = '확인',
  children,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay css={overlayStyle} />
        <Dialog.Content css={contentStyle}>
          <Dialog.Title css={titleStyle}>{title}</Dialog.Title>
          {children}
          <Dialog.Description css={descStyle}>
            {description.split('\n').map((line, idx) => (
              <span
                key={idx}
                style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </Dialog.Description>
          <ButtonWrapper>
            <Dialog.Close asChild>
              <ConfirmButton
                label={'cancel'}
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
