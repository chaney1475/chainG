import styled from '@emotion/styled'

// import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.background.white};
  position: relative;
`

export const FullMain = styled.main`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  height: calc(100% - 75px);
  overflow-y: auto;
`

export const NavigatorBar = styled.div`
  position: fixed;
  text-align: center;
  height: 75px;
  color: ${({ theme }) => theme.color.text.low};
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyRegular};
  z-index: 10;
`
