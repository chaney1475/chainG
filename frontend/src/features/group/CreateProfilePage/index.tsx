'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { InputBox, TitleHeaderLayout } from '@/components'
import { profileList } from '@/constants/profileList'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  setOwnerNickname,
  setOwnerProfileImage,
} from '@/store/slices/groupSlice'
import { Main } from '@/styles/styles'

import { ProfileSelector } from '../components/ProfileSelector'

export function CreateProfilePage({ leader }: { leader: boolean }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const create = useAppSelector((state) => state.group.create)
  const join = useAppSelector((state) => state.group.join)

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ nickname: string; profileImage: string }>({
    defaultValues: {
      nickname: leader ? create.ownerNickname : join.nickname,
      profileImage: leader ? create.ownerProfileImage : join.profileImage,
    },
  })
  const nickname = watch('nickname')
  if (leader) {
  }
  const existingNickname = useAppSelector(
    (state) => state.group.create.ownerNickname,
  )

  const [selected, setSelected] = useState(() => {
    const randomIndex = Math.floor(Math.random() * profileList.length)
    return profileList[randomIndex].id
  })

  useEffect(() => {
    if (existingNickname) {
      setValue('nickname', existingNickname)
    }
  }, [existingNickname, setValue])

  const handleComplete = () => {
    dispatch(setOwnerNickname(nickname))
    dispatch(setOwnerProfileImage(selected))
    router.push('/')
  }

  return (
    <TitleHeaderLayout
      title={t('createProfile.title')}
      header={t('createProfile.header')}
      description={t('createProfile.description')}
      label={t('createProfile.confirm')}
      onClick={handleComplete}
      buttonVariant={nickname ? 'next' : 'disabled'}>
      <Main>
        <ProfileSelector
          selectedId={selected}
          onSelect={setSelected}
        />
        <InputBox
          {...register('nickname')}
          label={t('createProfile.nickname.label')}
          id="nickname"
          {...register('nickname', {
            required: t('createProfile.nickname.error.required'),
          })}
          placeholder={t('createGroup.groupName.placeholder')}
          error={errors.nickname}
        />
      </Main>
    </TitleHeaderLayout>
  )
}
