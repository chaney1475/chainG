import { ConfirmButton, TitleHeader, TopHeader } from '@/components'
import { Container, Main } from '@/styles/styles'

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
        <ConfirmButton
          label={label}
          onClick={onClick}
        />
      </Container>
    </>
  )
}
