import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  gap: 50px;
  background-color: ${({ theme }) => theme.color.background.white};
`

export const FullMain = styled.div`
  display: flex;
  border: 1px solid red;
  padding: 0px 20px;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 38px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.white};
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
