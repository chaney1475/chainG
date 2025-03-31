import styled from '@emotion/styled'

export const Container = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 30px;
  width: 100%;
  gap: 30px;

  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.color.primary : theme.color.border};
  background-color: ${({ theme, selected }) =>
    selected ? theme.color.secondary : theme.color.background.white};
  border-radius: 16px;
  cursor: pointer;

  > div {
    ${({ theme }) => theme.typography.styles.default};
    color: ${({ theme }) => theme.color.text.low};
  }
`
