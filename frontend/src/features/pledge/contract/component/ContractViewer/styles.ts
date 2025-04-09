import styled from '@emotion/styled'

export const Container = styled.div`
  padding: 40px 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  text-align: center;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.color.background.white};
  opacity: 0.85;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
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

export const HeaderTitle = styled.div`
  ${({ theme }) => theme.typography.styles.topHeader};
  color: ${({ theme }) => theme.color.text.regular};
  white-space: nowrap;
`
export const DefaultLabel = styled.div`
  ${({ theme }) => theme.typography.styles.default};
  color: ${({ theme }) => theme.color.text.low};
`

export const UserContainer = styled.div`
  width: 100%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
`
export const BottomContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 40px;
  width: 100%;
`
