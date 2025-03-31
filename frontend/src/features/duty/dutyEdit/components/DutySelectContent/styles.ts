import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 20px;
  width: 100%;
  gap: auto;
`
export const TextContainer = styled.div`
  margin-bottom: 20px;
  ${({ theme }) => theme.typography.styles.title};
  color: ${({ theme }) => theme.color.text.regular};
`
export const DutySelectItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  width: 100%;
`

export const SheetBottomContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: auto;
`
export const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`
