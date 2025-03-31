'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { InputBox, TitleHeader, TitleHeaderLayout } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setGroupName, setMaxParticipants } from '@/store/slices/groupSlice'
import { CreateGroupRequest } from '@/types/group'

import {
  ImageButton,
  ImageContainer,
  Label,
  ParticipantsContainer,
} from './styles'

export function CreateGroupPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const create = useAppSelector((state) => state.group.create)

  const {
    register,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupRequest>({
    defaultValues: {
      groupName: create.groupName,
      maxParticipants: create.maxParticipants,
    },
  })
  const groupName = watch('groupName')
  const participants = watch('maxParticipants')

  useEffect(() => {
    return () => {
      console.log('unmount')
      const values = getValues()
      dispatch(setGroupName(values.groupName))
      dispatch(setMaxParticipants(values.maxParticipants))
    }
  }, [dispatch])

  const onSubmit = (data: CreateGroupRequest) => {
    dispatch(setGroupName(data.groupName))
    dispatch(setMaxParticipants(data.maxParticipants))
    router.push('/group/create/createProfile')
  }

  return (
    <TitleHeaderLayout
      title={t('createGroup.title')}
      header={t('createGroup.header')}
      label={t('createGroup.confirm')}
      onClick={handleSubmit(onSubmit)}
      buttonVariant={groupName ? 'next' : 'disabled'}>
      <ImageContainer>
        <Image
          src="/images/group/participants.png"
          alt="participants"
          width={106}
          height={105}
        />
      </ImageContainer>
      <div>
        <Label>{t('createGroup.maxParticipants.label')}</Label>
        <ParticipantsContainer>
          <ImageButton
            onClick={() =>
              setValue('maxParticipants', Math.max(1, participants - 1))
            }>
            <Image
              src="/icons/minus.svg"
              alt="minus"
              width={28}
              height={28}
            />
          </ImageButton>
          <TitleHeader title={participants + ''} />
          <ImageButton
            onClick={() => setValue('maxParticipants', participants + 1)}>
            <Image
              src="/icons/plus.svg"
              alt="plus"
              width={28}
              height={28}
            />
          </ImageButton>
        </ParticipantsContainer>
      </div>
      <InputBox
        {...register('groupName')}
        label={t('createGroup.groupName.label')}
        id="groupName"
        {...register('groupName', {
          required: t('createGroup.groupName.error.required'),
          maxLength: {
            value: 20,
            message: t('createGroup.groupName.error.maxLength'),
          },
        })}
        placeholder={t('createGroup.groupName.placeholder')}
        error={errors.groupName}
      />
    </TitleHeaderLayout>
  )
}
