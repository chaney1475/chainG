'use client'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { InputBox, TitleHeaderLayout } from '@/components'
import { setInviteCode } from '@/store/slices/groupSlice'
import { ButtonVariant } from '@/types/ui'

interface FormValues {
  inviteCode: string
}

const fakeServerValidation = async (inviteCode: string) => inviteCode === '1234'

export function ShareInviteCodePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FormValues>()

  const inviteCode = watch('inviteCode')

  const onSubmit = async (data: FormValues) => {
    const isValid = await fakeServerValidation(data.inviteCode)
    if (!isValid) {
      setError('inviteCode', {
        type: 'server',
        message: t('inviteCode.inviteCode.error.invalid'),
      })
      return
    }

    clearErrors('inviteCode')
    dispatch(setInviteCode(data.inviteCode))
    router.push('/group/create/createProfile')
  }

  return (
    <TitleHeaderLayout
      title={t('inviteCode.title')}
      header={t('inviteCode.description')}
      onClick={handleSubmit(onSubmit)}
      label={t('next')}
      buttonVariant={inviteCode ? ButtonVariant.next : ButtonVariant.disabled}>
      <InputBox
        {...register('inviteCode')}
        id="inviteCode"
        label={t('inviteCode.inviteCode.label')}
        placeholder={t('inviteCode.inviteCode.placeholder')}
        error={errors.inviteCode}
      />
    </TitleHeaderLayout>
  )
}
