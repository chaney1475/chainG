import styled from '@emotion/styled'

export const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60%;
  margin: auto;
  margin: 30px;
`
export const ImageContainer = styled.div`
  position: relative;
  height: 50dvh;
  align-items: center;
  display: flex;
  width: 100%;
  > div:first-child {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex;
    position: absolute;
    width: 50%;
    margin-left: 0;
  }
  > div:last-child {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    width: 50%;
    margin-left: auto;
  }
`
export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const LittleTitle = styled.h1`
  color: ${({ theme }) => theme.color.text.regular};
  font-family: var(--font-paperlogy-semi-bold);
  font-size: 1.625rem;
  white-space: pre-line;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.2s ease-out forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const StepControl = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`

export const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#4A90E2' : '#ccc')};
  border: none;
  cursor: pointer;
  transition: background 0.3s;
`
