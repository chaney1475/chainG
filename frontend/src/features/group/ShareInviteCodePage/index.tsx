'use client'

import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { TitleHeaderLayout } from '@/components'
import { IconButton } from '@/components/IconButton'
import { Label } from '@/components/InputBox/styles'
import { HeaderButton } from '@/components/TopHeader/styles'
import { useAppSelector } from '@/hooks/useAppSelector'
import { ImageContainer, ShowBox } from '@/styles/styles'

export function ShareInviteCodePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const group = useAppSelector((state) => state.group.group)
  const user = useAppSelector((state) => state.user.user)

  const handleCopy = () => {
    console.log(user)
    const message = `[chainG] ${user.name}님이 ${group.name}에 초대했어요.
    초대코드 : ${group.inviteCode}
    링크 : https://chaing.site/group/join?inviteCode=${encodeURIComponent(group.inviteCode)}
    `
    navigator.clipboard.writeText(message)
  }
  return (
    <TitleHeaderLayout
      title={t('shareInviteCode.title')}
      header={t('shareInviteCode.header')}
      description={t('shareInviteCode.description')}
      onClick={() => {
        router.push('/')
      }}
      label={'goToHome'}>
      <div>
        <ImageContainer>
          <Image
            src="/images/group/share-invite-code.png"
            alt="inviteCode"
            width={106}
            height={105}
          />
        </ImageContainer>
        <Label>{t('shareInviteCode.inviteCode.label')}</Label>
        <ShowBox>
          <HeaderButton />
          {group.inviteCode}
          <IconButton
            onClick={handleCopy}
            src="/icons/copy.svg"
            alt="copy"
          />
        </ShowBox>
      </div>
    </TitleHeaderLayout>
  )
}
