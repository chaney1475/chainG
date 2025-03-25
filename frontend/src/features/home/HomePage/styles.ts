import styled from '@emotion/styled'

export const Page = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  align-items: center;
  justify-items: center;
  min-height: 100svh;
  padding: 80px;
  gap: 64px;
  color: ${({ theme }) => theme.color.text.regular};
`

export const Main = styled.div`
  align-items: center;
  text-align: center;
  margin-top: 1.5rem;
  color: ${({ theme }) => theme.color.text.low};
`
