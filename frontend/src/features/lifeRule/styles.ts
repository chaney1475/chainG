import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.white};
  overflow: hidden;
`

export const FullMain = styled.main`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  height: 100%;

  border: 1px solid green;
  overflow: auto;
  padding-bottom: 75px;
`

export const NavigatorBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  height: 75px;
  border: 1px solid red;
  color: ${({ theme }) => theme.color.text.low};
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyRegular};
`
