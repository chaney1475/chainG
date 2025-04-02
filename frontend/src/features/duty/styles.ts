import styled from '@emotion/styled'

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
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.secondary};
`

export const Navigator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 10px;
  gap: 60px;
  width: 100%;
`
