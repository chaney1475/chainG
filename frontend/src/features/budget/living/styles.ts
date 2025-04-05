import styled from '@emotion/styled'

export const Account = styled.div`
  background-color: ${({ theme }) => theme.color.background.account};
  padding: 20px;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  align-self: stretch;
`
export const AccountTitle = styled.div`
  ${({ theme }) => theme.typography.styles.default};
  color: ${({ theme }) => theme.color.text.regular};
  width: 100%;
  text-align: left;
`
export const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
  > span {
    ${({ theme }) => theme.typography.styles.default};
    color: ${({ theme }) => theme.color.text.account};
    width: 100%;
  }
  > div {
    ${({ theme }) => theme.typography.styles.heading};
    color: ${({ theme }) => theme.color.text.regular};
    width: 100%;
  }
`
