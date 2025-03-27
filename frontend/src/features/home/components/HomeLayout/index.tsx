import { BottomNavigation, TopHeader } from '@/components'
import { Container, HeaderContainer, Main } from '@/styles/styles'

export function HomeLayout({
  title = '',
  header,
  label,
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
        <Main>{children}</Main>
        <BottomNavigation />
      </Container>
    </>
  )
}
