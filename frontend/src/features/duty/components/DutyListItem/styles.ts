import styled from '@emotion/styled'

export const Container = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`

export const CatrgoryIcon = styled.div`
  background-color: ${({ theme }) => theme.color.secondary};
  min-height: 48px;
  min-width: 48px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const DutyInfo = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  width: 100%;

  > div:first-of-type {
    ${({ theme }) => theme.typography.styles.description};
    color: ${({ theme }) => theme.color.text.disabled};
  }
  > div:last-of-type {
    ${({ theme }) => theme.typography.styles.default};
    color: ${({ theme }) => theme.color.text.low};
    white-space: pre-wrap;
    max-width: 100%;
    word-break: break-all;
    line-height: 1.5;
  }
`
