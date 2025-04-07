'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

import { transferToOwner } from '@/apis/payment'
import { getMySummary } from '@/apis/user'
import { InputBox, Modal, TitleHeaderLayout } from '@/components'
import { useAppSelector } from '@/hooks'
import { setSummary } from '@/store/slices/userSlice'
import { ButtonVariant } from '@/types/ui'

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

export function TransferToOwnerPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

  const summary = useAppSelector((state) => state.user.summary)

  const {
    register,
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

  useEffect(() => {
    if (summary.id == 0) {
      fetchSummary()
    } else if (summary.myAccountNo) {
      setValue('myAccountNo', summary.myAccountNo)
    }
  }, [summary])

  const fetchSummary = async () => {
    const response = await getMySummary()
    if (response.success) {
      dispatch(setSummary(response.data))
    }
  }
  const livingAccountNo = useAppSelector(
    (state) => state.livingBudget.livingAccountNo,
  )
  if (!livingAccountNo) {
    router.push('/budget/living/create')
  }
  const userName = useAppSelector((state) => state.user.user.nickname)
  const myAccountNo = watch('myAccountNo')
  const balance = watch('balance')

  const [next, setNext] = useState(false)
  const disabled = !livingAccountNo || !balance || !myAccountNo

  useEffect(() => {
    if (next && !disabled) {
      handleSubmit(onSubmit)()
    }
  }, [next])

  const handleNext = () => {
    setNext(true)
  }
  const hasTransfered = useRef(false)
  const currentMonth = useMemo(() => Number(format(new Date(), 'yyyyMM')), [])

  const [success, setSuccess] = useState(false)
  const onSubmit = async (data: DepositForm) => {
    if (hasTransfered.current) return
    hasTransfered.current = true

    setSuccess(
      await transferToOwner({
        month: currentMonth,
        depositAccountNo: myAccountNo,
        transactionBalance: Number(balance),
      }),
    )
  }

  const handleMyAccountNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    setValue('myAccountNo', newValue)
    setNext(false)
  }

  const balanceRegister = register('balance', {
    required: t('payment.transfer.owner.balance.error.required'),
  })

  const myAccountNoRegister = register('myAccountNo', {
    required: t('payment.transfer.owner.myAccountNo.error.required'),
    validate: (value) => {
      if (value === livingAccountNo) {
        return t('payment.transfer.owner.myAccountNo.error.same')
      }
      return true
    },
  })
  return (
    <TitleHeaderLayout
      title={t('payment.transfer.owner.title')}
      label={t('payment.transfer.owner.label')}
      header={t('payment.transfer.owner.header')}
      onClick={handleNext}
      buttonVariant={disabled ? ButtonVariant.disabled : ButtonVariant.next}>
      <Container>
        <InputBox
          label={t('payment.transfer.owner.myAccountNo.label')}
          id="myAccountNo"
          type="text"
          value={myAccountNo}
          onChange={handleMyAccountNoChange}
          ref={myAccountNoRegister.ref}
          placeholder={t('payment.transfer.owner.myAccountNo.placeholder')}
          error={errors.myAccountNo}
        />

        <InputBox
          id="balance"
          name="balance"
          label={t('payment.transfer.owner.balance.label')}
          type="money"
          value={balance}
          onChange={(e) => {
            const numeric = e.target.value.replace(/[^0-9]/g, '')
            setValue('balance', numeric)
            setNext(false)
          }}
          ref={balanceRegister.ref}
          placeholder={t('payment.transfer.owner.balance.placeholder')}
          error={errors.balance}
        />
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
