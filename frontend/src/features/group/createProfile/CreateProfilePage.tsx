'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { ConfirmButton, InputBox, TitleHeader, TopHeader } from '@/components'
import { profileList } from '@/constants/profileList'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  setGroupName,
  setOwnerNickname,
  setOwnerProfileImage,
} from '@/store/slices/groupSlice'
import { Container, Main } from '@/styles/styles'

import ProfileSelector from './components/ProfileSelector'

export function CreateProfilePage() {
  const { t } = useTranslation()
  const { register, watch, setValue } = useForm()
  const nickname = watch('nickname')
  const dispatch = useDispatch()
  const router = useRouter()
  const existingNickname = useAppSelector(
    (state) => state.group.create.ownerNickname,
  )

  const [selected, setSelected] = useState(() => {
    const randomIndex = Math.floor(Math.random() * profileList.length)
    return profileList[randomIndex].id
  })

  // 기존 닉네임이 있다면 form에 설정
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
    <Container>
      <TopHeader title={t('createProfile.title')} />
      <Main>
        <TitleHeader
          title={t('createProfile.title')}
          description={t('createProfile.description')}
        />
        <ProfileSelector
          selectedId={selected}
          onSelect={setSelected}
        />
        <InputBox
          {...register('nickname')}
          id="nickname"
          placeholder={t('createProfile.nickname.placeholder')}
        />
      </Main>
      <ConfirmButton
        label={t('createProfile.confirm')}
        onClick={handleComplete}
        variant={nickname ? 'next' : 'disabled'}
      />
    </Container>
  )
}
