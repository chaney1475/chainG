import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  border: 1px solid red;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.white};
`

export const FullMain = styled.div`
  padding: 1.25rem;
  display: flex;
  border: 1px solid red;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 60px;
  width: 100%;
`

export const Navigator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid;
  height: 75px;
  gap: 60px;
  width: 100%;
`
