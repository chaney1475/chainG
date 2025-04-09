import styled from '@emotion/styled'

export const Container = styled.div`
  padding: 20px 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.background.white};
  border-radius: 16px;
`
export const ContentsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`
