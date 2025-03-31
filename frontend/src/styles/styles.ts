import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  height: 100dvh;
  width: 100%;
  @media (min-width: 768px) {
    width: 50%;
    justify-content: center;
    margin: 0 auto;
  }
`

export const HeaderContainer = styled.div`
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.typography.styles.title};
  color: ${({ theme }) => theme.color.text.regular};
`

export const BottomContainer = styled.div`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  min-height: 60%;
  margin: auto;
  gap: 60px;
  width: 100%;
`

export const FullMain = styled.div`
  padding: 0 1.25rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

export const Form = styled.form`
  width: 100%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
`

export const SwitcherContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

export const ShowBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.background.white};

  &:focus {
    outline: 1px solid ${({ theme }) => theme.color.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.primary}10;
  }
`
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  ${({ theme }) => theme.typography.styles.inputBoxTitle};
  color: ${({ theme }) => theme.color.text.regular};
`
export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
