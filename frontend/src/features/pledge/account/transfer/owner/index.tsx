'use client'

import { useEffect, useRef, useState } from 'react'
import { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import { useRouter, useSearchParams } from 'next/navigation'

import { transferToOwner } from '@/apis/payment'
import { getMySummary } from '@/apis/user'
import { Modal, TitleHeaderLayout } from '@/components'
import { useAppSelector } from '@/hooks'
import { setSummary } from '@/store/slices/userSlice'
import {
  DefaultLabel,
  Label,
  RegularLabel,
  ShowBox,
  ShowCenterBox,
} from '@/styles/styles'
import { ButtonVariant } from '@/types/ui'
import { formatMoney } from '@/utils/format'
import { formatTime } from '@/utils/formatTime'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
`

interface DepositForm {
  myAccountNo: string
  balance: string
}

registerLocale('ko', ko)
export function TransferToOwnerPage() {
  const searchParams = useSearchParams()
  const month = searchParams.get('month')
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

  const summary = useAppSelector((state) => state.user.summary)
  const livingAccountNo = useAppSelector(
    (state) => state.livingBudget.livingAccountNo,
  )
  const userName = useAppSelector((state) => state.user.user.nickname)

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DepositForm>({
    defaultValues: {
      myAccountNo: summary.myAccountNo,
      balance: '',
    },
  })

  const myAccountNo = watch('myAccountNo')
  const balance = watch('balance')
  const disabled = !livingAccountNo || !balance || !myAccountNo

  const [next, setNext] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const hasTransfered = useRef(false)

  const rent = useAppSelector((state) => state.contract.contract.rent)

  useEffect(() => {
    if (summary.id === 0) {
      fetchSummary()
    } else if (summary.myAccountNo) {
      setValue('myAccountNo', summary.myAccountNo)
    }
  }, [summary])

  useEffect(() => {
    if (next) {
      onSubmit()
    }
  }, [next])

  useEffect(() => {
    if (!rent.ownerAccountNo) {
      router.push('/pledge')
    }
  }, [rent.ownerAccountNo])

  const fetchSummary = async () => {
    const response = await getMySummary()
    if (response.success) {
      dispatch(setSummary(response.data))
    }
  }

  const handleNext = () => {
    setNext(true)
  }

  const onSubmit = async () => {
    if (hasTransfered.current) return
    hasTransfered.current = true
    setSuccess(
      await transferToOwner({
        month: Number(month),
        depositAccountNo: rent.rentAccountNo,
        transactionBalance: Number(rent.totalAmount),
      }),
    )
    hasTransfered.current = false
  }

  return (
    <TitleHeaderLayout
      title={t('payment.transfer.owner.title')}
      label={t('payment.transfer.owner.label')}
      header={t('payment.transfer.owner.header')}
      onClick={handleNext}>
      <Container>
        <Label> {t('payment.transfer.owner.unpaid', { month })}</Label>
        <ShowCenterBox>
          <DefaultLabel>{formatMoney(rent.totalAmount)}</DefaultLabel>
        </ShowCenterBox>
      </Container>
      <Modal
        open={success}
        onOpenChange={setSuccess}
        title={t('payment.transfer.owner.success.title')}
        description={t('payment.transfer.owner.success.description', {
          userName,
          balance,
        })}
        confirmText={t('confirm')}
        onConfirm={() => {
          setSuccess(false)
          router.push('/pledge')
        }}
      />
    </TitleHeaderLayout>
  )
}
