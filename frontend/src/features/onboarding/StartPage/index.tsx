'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  BottomSheet,
  CardButton,
  ConfirmButton,
  IconButton,
  TitleHeader,
} from '@/components'
import { HeaderButton } from '@/components/TopHeader/styles'
import { BottomContainer, Container, HeaderContainer } from '@/styles/styles'
import { CardItem } from '@/types/ui'

import { ImageContainer, Main } from './styles'

export function StartPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const stepContent = [
    {
      id: 'blockchain',
      title: t('onboarding.blockChain'),
      image: '/images/onboarding/onboarding-blockchain.png',
    },
    {
      id: 'transfer',
      title: t('onboarding.transfer'),
      image: '/images/onboarding/onboarding-transfer.png',
    },
    {
      id: 'budget',
      title: t('onboarding.budget'),
      image: '/images/onboarding/onboarding-budget.png',
    },
    {
      id: 'awkward',
      title: t('onboarding.awkward'),
      image: '/images/onboarding/onboarding-awkward.png',
    },
    {
      id: 'start',
      title: t('onboarding.start'),
      image: '/images/onboarding/onboarding-start.png',
    },
  ]

  const cardItems: CardItem[] = [
    {
      url: '/group/create',
      image: '/images/group/group-create.svg',
      title: t('onboarding.create.title'),
      description: t('onboarding.create.description'),
    },
    {
      url: '/group/join',
      image: '/images/group/group-join.svg',
      title: t('onboarding.join.title'),
      description: t('onboarding.join.description'),
    },
  ]
  // 현재 step의 id가 start면 confirm 버튼 의 레이블을 onBoarding.confirm 변경
  const isConfirmButtonVisible = stepContent[step].id === 'start'

  const handleNext = () => {
    if (isConfirmButtonVisible) {
      setIsBottomSheetOpen(true)
    } else {
      setStep(step + 1)
    }
  }
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  return (
    <Container>
      <HeaderContainer>
        <IconButton
          src="/icons/arrow-left.svg"
          alt={t('icon.back')}
          onClick={handleBack}
        />
        {'ChainG'}
        <HeaderButton />
      </HeaderContainer>
      <Main>
        <TitleHeader title={stepContent[step].title} />
        <ImageContainer>
          <Image
            src={stepContent[step].image}
            alt={stepContent[step].title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </ImageContainer>
      </Main>

      <BottomContainer>
        <ConfirmButton
          onClick={handleNext}
          label={isConfirmButtonVisible ? t('onboarding.confirm') : t('next')}
        />
      </BottomContainer>
      <BottomSheet
        open={isBottomSheetOpen}
        onOpenChange={setIsBottomSheetOpen}
        snapPoints={{
          MIN: 0.1,
          MID: 0.5,
          MAX: 0.5,
        }}>
        <HeaderContainer>{t('onboarding.title')}</HeaderContainer>
        <CardButton cardItems={cardItems} />
      </BottomSheet>
    </Container>
  )
}
