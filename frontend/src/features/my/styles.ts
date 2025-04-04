import styled from '@emotion/styled'

export const FullMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.secondary};
  overflow-y: auto;
`
