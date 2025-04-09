import Image from 'next/image'

import { BottomNavigation } from '@/components'
import { Container, HeaderContainer, SimpleMain } from '@/styles/styles'

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
  return (
    <>
      <Container>
        <HeaderContainer>
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={24}
            height={24}
          />
          {headerRightButton}
        </HeaderContainer>
        <SimpleMain>{children}</SimpleMain>
        <BottomNavigation />
      </Container>
    </>
  )
}
