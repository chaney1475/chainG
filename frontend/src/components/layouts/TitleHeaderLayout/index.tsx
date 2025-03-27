import { ConfirmButton, TitleHeader, TopHeader } from '@/components'
import { BottomContainer, Container, Main } from '@/styles/styles'

export function TitleHeaderLayout({
  title = '',
  header,
  label,
  children,
  onClick,
}: {
  title?: string
  header: string
  label?: string
  children: React.ReactNode
  onClick: () => void
}) {
  return ( 
    <>
      <Container>
        <TopHeader title={title} />
        <Main>
          <TitleHeader title={header} />
          {children}
        </Main>
        <BottomContainer>
          <ConfirmButton
            label={label}
            onClick={onClick}
          />
        </BottomContainer>
      </Container>
    </>
  )
}
