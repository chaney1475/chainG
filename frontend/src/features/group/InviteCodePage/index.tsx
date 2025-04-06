'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter, useSearchParams } from 'next/navigation'

import { getGroupByInviteCode } from '@/apis/group'
import { InputBox, TitleHeaderLayout } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  setGroup,
  setInviteCode,
  setJoinGroupId,
} from '@/store/slices/groupSlice'
import { ButtonVariant } from '@/types/ui'

interface FormValues {
  inviteCode: string
}

export function InviteCodePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  //params에서 inviteCode 가져오기
  const searchParams = useSearchParams()
  const defaultInviteCode = searchParams.get('inviteCode') || ''
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      inviteCode: defaultInviteCode,
    },
  })
  const accessToken = useAppSelector(
    (state) => state.auth.loginToken.accessToken,
  )
  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login')
      return
    }
  }, [accessToken, router])
  const currentInviteCode = watch('inviteCode')

  const onSubmit = async (data: FormValues) => {
    clearErrors('inviteCode')
    dispatch(setInviteCode(data.inviteCode))

    const group = await getGroupByInviteCode(data.inviteCode)
    if (group.success) {
      dispatch(setJoinGroupId(group.data.id))
      console.log(group.data)
      dispatch(setGroup(group.data))
      router.push('/group/join/createProfile')
    } else {
      setError('inviteCode', {
        type: 'server',
        message: t('inviteCode.inviteCode.error.invalid'),
      })
    }
  }

  return (
    <TitleHeaderLayout
      title={t('inviteCode.label')}
      header={t('inviteCode.placeholder')}
      onClick={handleSubmit(onSubmit)}
      label={t('next')}
      buttonVariant={
        currentInviteCode ? ButtonVariant.next : ButtonVariant.disabled
      }>
      <InputBox
        {...register('inviteCode')}
        id="inviteCode"
        label={t('inviteCode.label')}
        placeholder={t('join.inviteCode.placeholder')}
        error={errors.inviteCode}
        value={currentInviteCode}
      />
    </TitleHeaderLayout>
  )
}
