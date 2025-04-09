'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { InputBox, TitleHeader, TitleHeaderLayout } from '@/components'
import { Image } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setGroupName, setMaxParticipants } from '@/store/slices/groupSlice'
import { CreateGroupRequest } from '@/types/group'

import {
  HomeImageContainer,
  ImageButton,
  Label,
  ParticipantsContainer,
  UserContainer,
} from './styles'

export function CreateGroupPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const create = useAppSelector((state) => state.group.create)
  const participantsRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (participantsRef.current) {
      participantsRef.current.focus()
    }
  }, [participantsRef])

  const onSubmit = (data: CreateGroupRequest) => {
    dispatch(setGroupName(data.groupName))
    dispatch(setMaxParticipants(data.maxParticipants))
    router.push('/group/create/createProfile')
  }
  const increaseParticipants = () => {
    setValue('maxParticipants', Math.min(10, participants + 1))
  }
  const decreaseParticipants = () => {
    setValue('maxParticipants', Math.max(1, participants - 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      increaseParticipants()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      decreaseParticipants()
    }
  }
  return (
    <TitleHeaderLayout
      title={t('createGroup.title')}
      header={t('createGroup.header')}
      label={t('createGroup.confirm')}
      onClick={handleSubmit(onSubmit)}
      buttonVariant={groupName ? 'next' : 'disabled'}>
      <HomeImageContainer>
        <Image
          src="/images/group/roof.svg"
          alt="plus"
          width={322}
          height={61}
        />
        <UserContainer>
          {Array.from({ length: participants }).map((_, index) => (
            <Image
              key={index}
              src="/images/group/user-default.svg"
              alt="plus"
              width={80}
              height={80}
            />
          ))}{' '}
        </UserContainer>
        <Image
          src="/images/group/floor.svg"
          alt="plus"
          width={272}
          height={9}
        />
      </HomeImageContainer>

      <div>
        <Label>{t('createGroup.maxParticipants.label')}</Label>
        <ParticipantsContainer
          ref={participantsRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="참가자 수 조절">
          <ImageButton onClick={decreaseParticipants}>
            <Image
              src="/icons/minus.svg"
              alt="minus"
              width={28}
              height={28}
            />
          </ImageButton>
          <TitleHeader title={participants + ''} />
          <ImageButton onClick={increaseParticipants}>
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
