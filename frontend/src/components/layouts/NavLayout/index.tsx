import { BottomNavigation, TopHeader } from '@/components'
import { Container, Main } from '@/styles/styles'

export function NavLayout({
  title = '',
  children,
  headerRightButton,
}: {
  title?: string
  children: React.ReactNode
  headerRightButton: React.ReactNode
}) {
  return (
    <>
      <Container>
        <TopHeader
          title={title}
          headerRightButton={headerRightButton}
        />
        <Main>{children}</Main>
        <BottomNavigation />
      </Container>
    </>
  )
}
