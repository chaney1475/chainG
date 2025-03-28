import { BottomNavigation } from '@/components'
import { Container, FullMain, HeaderContainer } from '@/styles/styles'

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
          {header}
          {headerRightButton}
        </HeaderContainer>
        <FullMain>{children}</FullMain>
        <BottomNavigation />
      </Container>
    </>
  )
}
