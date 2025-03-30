import { ConfirmButton, TitleHeader, TopHeader } from '@/components'
import { BottomContainer, Container, Main } from '@/styles/styles'
import { ButtonVariant } from '@/types/ui'

export function TitleHeaderLayout({
  title = '',
  header,
  description,
  label,
  children,
  onClick,
  buttonVariant = ButtonVariant.next,
}: {
  title?: string
  header: string
  description?: string
  label?: string
  children: React.ReactNode
  onClick: () => void
  buttonVariant?: ButtonVariant
}) {
  return (
    <>
      <Container>
        <TopHeader title={title} />
        <Main>
          <TitleHeader
            title={header}
            description={description}
          />
          {children}
        </Main>
        <BottomContainer>
          <ConfirmButton
            label={label}
            onClick={onClick}
            variant={buttonVariant}
          />
        </BottomContainer>
      </Container>
    </>
  )
}
