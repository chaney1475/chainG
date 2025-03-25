'use client'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { ConfirmButton, InputBox, TitleHeader, TopHeader } from '@/components'
import { setInviteCode } from '@/store/slices/groupSlice'
import { containerStyle, mainStyle } from '@/styles/styles'

interface FormValues {
  code: string
}

const fakeServerValidation = async (code: string) => code === '1234'

export function InviteCodePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    const isValid = await fakeServerValidation(data.code)

    if (!isValid) {
      setError('code', {
        type: 'server',
        message: t('inviteCode.error.invalid'),
      })
      return
    }

    clearErrors('code')
    dispatch(setInviteCode(data.code))
    router.push('/group/create/createProfile')
  }

  return (
    <div css={containerStyle}>
      <TopHeader title={t('inviteCode.title')} />
      <main css={mainStyle}>
        <TitleHeader title={t('inviteCode.description')} />
        <InputBox
          {...register('code')}
          placeholder={t('inviteCode.placeholder')}
          error={errors.code?.message}
        />
      </main>
      <ConfirmButton
        label={t('common.next')}
        onClick={handleSubmit(onSubmit)}
        variant="next"
      />
    </div>
  )
}
