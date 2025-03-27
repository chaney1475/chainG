import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  height: 100vh;
`
export const HeaderContainer = styled.div`
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.typography.styles.title};
  color: ${({ theme }) => theme.color.text.regular};
`

export const BottomContainer = styled.div`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 60%;
  gap: 60px;
  width: 100%;
`
export const Form = styled.form`
  width: 100%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
`
