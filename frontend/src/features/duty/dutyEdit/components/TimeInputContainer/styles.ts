import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  padding: 16px;
  width: 100%;
  height: 100px;
  border: 1px solid red;
  gap: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.secondary};
  ${({ theme }) => theme.typography.styles.default}
  color: ${({ theme }) => theme.color.text.low}
`
export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: start;
  align-items: start;
  gap: 16px;
`
