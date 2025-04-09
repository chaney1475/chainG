import styled from '@emotion/styled'

export const Main = styled.div`
  position: relative;
  align-items: left;
  display: flex;
  text-align: left;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
  height: 60%;
  justify-content: flex-start;
  > div {
    align-items: left;
  }
`
export const GroupName = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyBold};
  font-size: 22px;
  color: ${({ theme }) => theme.color.text.regular};
`
export const Description = styled.div`
  font-family: ${({ theme }) => theme.typography.fonts.paperlogyMedium};
  font-size: 1rem;
  color: ${({ theme }) => theme.color.text.disabled};
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  gap: 4px;
  width: 100%;
  align-items: flex-end;
`
export const NoticeContainer = styled.div`
  display: flex;
  flex-direction: flex-end;
  gap: 16px;
`
export const Dday = styled.div`
  ${({ theme }) => theme.typography.styles.title};
  color: ${({ theme }) => theme.color.text.regular};
  width: 100%;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.2s ease-out forwards;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: flex-end;
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
  > span {
    ${({ theme }) => theme.typography.styles.description};
    color: ${({ theme }) => theme.color.text.disabled};
  }
  > div {
    ${({ theme }) => theme.typography.styles.title};
    color: ${({ theme }) => theme.color.primary};
  }
  > p {
    ${({ theme }) => theme.typography.styles.description};
    color: ${({ theme }) => theme.color.text.disabled};
  }
`

export const UserTileContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: auto;
  background-color: rgba(256, 256, 256, 0.5) !important;
`
export const MainWrapper = styled.div`
  position: absolute;
  top: 560px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  > div {
    position: absolute;
    top: -150px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.color.background.white};
    margin: auto;
    padding: 1rem 0;
    width: 80%;
    flex-wrap: wrap;
  }
`
