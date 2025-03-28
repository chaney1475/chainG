import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  gap: 8px;
  background-color: ${({ theme }) => theme.color.background.white};
`
