import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  height: 100%;
`
export const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 46px;
`
export const Name = styled.div`
  ${({ theme }) => theme.typography.styles.navigator};
  color: ${({ theme }) => theme.color.text.low};
  white-space: nowrap;
`
