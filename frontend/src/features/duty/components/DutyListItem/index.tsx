'use client'

import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { dutyCategoryList } from '@/constants/dutyList'
import { Duty } from '@/types/duty'

import { Assignees } from '../Assignees'
import { CatrgoryIcon, Container, DutyInfo } from './styles'

interface DutyListItemProps {
  duty: Duty
}

export const DutyListItem = ({ duty }: DutyListItemProps) => {
  const { t } = useTranslation()

  return (
    <Container>
      <CatrgoryIcon>
        <Image
          src={
            dutyCategoryList.find((category) => category.id === duty.category)
              ?.src ?? '/images/duty/duty-category-clean.png' // 이미지 없을때 기본값 지정
          }
          alt={duty.category}
          width={32}
          height={32}
        />
      </CatrgoryIcon>
      <DutyInfo>
        <div>
          {t(`duty.category.${duty.category}`)} {duty.dutyTime}
        </div>
        <div>{duty.title}</div>
      </DutyInfo>
      <Assignees assignees={duty.assignees} />
      <Image
        src="/icons/menu.svg"
        alt={duty.category}
        width={12}
        height={12}
      />
    </Container>
  )
}
