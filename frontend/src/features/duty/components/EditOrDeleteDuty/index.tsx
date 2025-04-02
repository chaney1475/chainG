'use client'

import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { deleteDuty } from '@/apis/duty'
import { useDispatch } from 'react-redux'

import { removeDutyFromList, setEditDuty, setCreateDayOfWeek } from '@/store/slices/dutySlice'

import { Duty } from '@/types/duty'

import { Container, TextContainer } from './styles'

interface EditOrDeleteDutyProps {
  selectedDuty: Duty | null
  setOpen: (open: boolean) => void
}

//TODO: 수정기능 구현
export const EditOrDeleteDuty = ({
  selectedDuty,
  setOpen,
}: EditOrDeleteDutyProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()

  const handleEdit = () => {
    if (selectedDuty !== null) {
      dispatch(setEditDuty(selectedDuty))
      dispatch(setCreateDayOfWeek(selectedDuty.dayOfWeek))
      router.push('/duty/edit')
      setOpen(false)
    }
  }

  //TODO: 삭제기능 화면 바로 반영 안됨.. REDUX로 해봤는데도 실패
  const handleDelete = async () => {
    if (selectedDuty !== null) {
      const response = await deleteDuty(selectedDuty.id)
      if (response.success) {
        console.log(response.data)
        dispatch(removeDutyFromList(selectedDuty))
        router.refresh()
        setOpen(false)
      } else {
        console.log('error')
      }
    }
  }

  return (
    <Container>
      <TextContainer onClick={handleEdit}>
        {t('duty.button.edit')}
      </TextContainer>
      <hr />
      <TextContainer onClick={handleDelete}>
        {t('duty.button.delete')}
      </TextContainer>
    </Container>
  )
}
