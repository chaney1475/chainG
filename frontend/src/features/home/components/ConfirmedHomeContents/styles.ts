import styled from '@emotion/styled'

export const Container = styled.div`
  padding: 20px 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.white};
  height: 100%;
`
export const ContentsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
`
