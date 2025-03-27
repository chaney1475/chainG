import styled from '@emotion/styled'
import Link from 'next/link'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 49px;
  gap: 16px;
  border: 1px solid red;

  > div:first-child {
    ${({ theme }) => theme.typography.fonts.paperlogyRegular};
    color: ${({ theme }) => theme.color.text.disabled};
  }
`

export const DateSelection = styled.div`
  display: flex;
  height: 48px;
  width: 48px;
  flex-direction: row;
`
