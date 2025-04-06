import styled from '@emotion/styled'

export const FullMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  gap: 10px;
  padding: 20px;
  overflow-y: auto;
  `
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  height: 100dvh;
  width: 100%;
  background-color: ${({ theme }) => theme.color.secondary};
  @media (min-width: 768px) {
    width: 50%;
    justify-content: center;
    margin: 0 auto;
  }
`
export const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 16px;
  padding: 20px 20px 40px;
  background-color: ${({ theme }) => theme.color.background.white};
` 

export const BottomContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 40px;
  width: 100%;
  `
