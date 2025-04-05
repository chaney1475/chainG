import styled from '@emotion/styled'

export const Page = styled.div`
  display: grid;
  grid-template-rows: 20px 1fr 20px;
  align-items: center;
  justify-items: center;
  min-height: 100svh;
  padding: 80px;
  gap: 64px;
  color: ${({ theme }) => theme.color.text.regular};
`

export const Main = styled.div`
  align-items: center;
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 4px;
  gap: 4px;
  justify-content: center;
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
  vertical-align: middle;
`
export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  > div {
    position: absolute;
    bottom: 0;
    background-color: ${({ theme }) => theme.color.background.white};
    margin: auto;
  }
`
