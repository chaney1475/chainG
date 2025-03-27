import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
  border: 1px solid blue;
  background-color: ${({ theme }) => theme.color.background.white};
`
