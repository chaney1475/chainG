'use client'

import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { deleteDuty } from '@/apis/duty'

import { Container, TextContainer } from './styles'

interface EditOrDeleteDutyProps {
  selectedDutyId: number | null
}

export const EditOrDeleteDuty = ({ selectedDutyId }: EditOrDeleteDutyProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  const handleEdit = () => {
    if (selectedDutyId !== null) {
      // router.push(`/duty/edit/${selectedDutyId}`)
    }
  }

  const handleDelete = async () => {
    if (selectedDutyId !== null) {
      //Todo: 삭제 redirect 필요
      const response = await deleteDuty(selectedDutyId)
      if (response.success) {
        console.log(response.data)
        router.push('/duty')
      } else {
        console.log('error')
      }
    }
  }

  console.log(selectedDutyId)

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
