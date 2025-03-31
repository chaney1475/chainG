import styled from '@emotion/styled'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SelectedImage = styled.img`
  border-radius: 50%;
  margin-bottom: 20px;
`

export const ProfileGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`

export const ProfileImage = styled.img<{
  isSelected: boolean
  primaryColor: string
}>`
  border-radius: 50%;
  border: 3px solid
    ${({ isSelected, primaryColor }) =>
      isSelected ? primaryColor : 'transparent'};
  box-sizing: border-box;
  cursor: pointer;
`

export const ProfileList = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
`

export const ProfileItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid
      ${({ isSelected }) => (isSelected ? '#FF6B00' : 'transparent')};
  }

  span {
    font-size: 0.875rem;
    font-family: ${({ theme }) => theme.typography.styles.name};
    color: ${({ theme }) => theme.color.text.low};
  }
`
