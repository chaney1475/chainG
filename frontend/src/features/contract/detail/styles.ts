import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    39deg,
    #f1f3f6 35.86%,
    #d9deeb 66.78%,
    #c6def2 99.55%
  );
  gap: 20px;
`

export const HeaderContainer = styled.div`
  padding: 40px 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: center;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.background.white};
  opacity: 0.85;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`

export const FullMain = styled.div`
  padding: 1.25rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 60px;
  width: 100%;
`

export const Navigator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid;
  height: 75px;
  gap: 60px;
  width: 100%;
`
