import { useState } from 'react'

import styled from '@emotion/styled'

import { BottomSheet, CustomPicker, UserItem } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { FullMain, ShowBox, UserTileContainer } from '@/styles/styles'

import { Switch } from '../Switch'

interface RentRatioProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  onText?: string
  offText?: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
`

export function RentRatio({
  checked = false,
  onChange,
  label,
  onText = '비율',
  offText = '금액',
}: RentRatioProps) {
  const [open, setOpen] = useState(false)
  const group = useAppSelector((state) => state.group.group)

  const handleChange = (value: Record<string, string>, key: string) => {
    console.log(value, key)
  }

  const pickerValue = group.members.reduce(
    (acc, member) => {
      acc[member.id] = '1'
      return acc
    },
    {} as Record<string, string>,
  )

  const selections = group.members.reduce(
    (acc, member) => {
      acc[member.id] = Array.from({ length: 100 }, (_, i) => (i + 1).toString())
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <Container>
      <Switch
        checked={checked}
        onChange={onChange}
        onText={onText}
        offText={offText}
      />
      {checked ? (
        <div>
          <ShowBox onClick={() => setOpen(true)}>ㅅㄷ</ShowBox>
          비율
        </div>
      ) : (
        <div>금액</div>
      )}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}>
        <FullMain>
          월세비율을 정해주세요
          <UserTileContainer>
            {group.members.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                size="small"
              />
            ))}
          </UserTileContainer>
          <CustomPicker<Record<string, string>>
            handleChange={handleChange}
            pickerValue={pickerValue}
            selections={selections}
          />
        </FullMain>
      </BottomSheet>
    </Container>
  )
}
