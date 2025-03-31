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
