import { useMemo } from 'react'

import Image from 'next/image'

import { BottomNavigation } from '@/components'
import {
  Container,
  ContentWrapper,
  HeaderContainer,
  HomeMain,
  MainImageContainer,
} from '@/styles/styles'
import { useMorning } from '@/utils/formatTime'

export function HomeLayout({
  header,
  children,
  headerRightButton,
}: {
  title?: string
  header: string
  label?: string
  children: React.ReactNode
  headerRightButton: React.ReactNode
}) {
  const morning = useMorning()
  return (
    <>
      <Container>
        <MainImageContainer>
          {morning ? (
            <Image
              src={'/images/home/home-morning.svg'}
              alt="home-main"
              fill
              style={{ objectFit: 'contain', objectPosition: 'top' }}
            />
          ) : (
            <Image
              src={'/images/home/home-night.svg'}
              alt="home-main"
              fill
              style={{ objectFit: 'contain', objectPosition: 'top' }}
            />
          )}
        </MainImageContainer>
        <ContentWrapper>
          <HeaderContainer>
            <Image
              src="/icons/logo-no-padding.svg"
              alt="logo"
              width={24}
              height={24}
            />
            {headerRightButton}
          </HeaderContainer>
          <HomeMain>{children}</HomeMain>
          <BottomNavigation />
        </ContentWrapper>
      </Container>
    </>
  )
}
