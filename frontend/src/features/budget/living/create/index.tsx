'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { TitleHeaderLayout } from '@/components'
import { useAppSelector, useIsLeader } from '@/hooks'
import { ButtonVariant } from '@/types/ui'

export function BudgetLivingCreatePage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [next, setNext] = useState(false)
  const isLeader = useIsLeader()
  const group = useAppSelector((state) => state.group.group)
  const user = useAppSelector((state) => state.user.user)
  const handleNext = () => {
    setNext(true)
  }

  return (
    <TitleHeaderLayout
      title="생활비"
      label="생활비 송금"
      onClick={handleNext}
      buttonVariant={ButtonVariant.next}>
      <div>생활비 송금</div>
    </TitleHeaderLayout>
  )
}
