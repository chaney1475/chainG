import styled from '@emotion/styled'

export const Container = styled.div`
  padding: 20px 16px;
  border:1px solid blue;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HeaderButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${({ theme }) => theme.typography.styles.title};
  color: ${({ theme }) => theme.color.text.regular};
  display: flex;
  align-items: center;
  gap: 8px;
`
