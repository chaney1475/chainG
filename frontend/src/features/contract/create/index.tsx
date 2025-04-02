'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  BottomNavigation,
  BottomSheet,
  ProgressBar,
  TopHeader,
  UserItem,
} from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { Container, UserTileContainer } from '@/styles/styles'

import { FullMain } from './styles'

export function ContractCreatePage() {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)

  const group = useAppSelector((state) => state.group.group)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true)
  return (
    <Container>
      <TopHeader title={t('contract')} />
      <FullMain>
        <ProgressBar
          step={step}
          steps={6}
        />
        <button onClick={() => setStep(Math.min(step + 1, 6))}>next</button>
        <BottomSheet
          open={isBottomSheetOpen}
          onOpenChange={setIsBottomSheetOpen}
          snapPoints={{
            MIN: 0.1,
            MID: 0.5,
            MAX: 0.6,
          }}>
          <UserTileContainer>
            {group.members.map((user) => (
              <UserItem
                key={user.id}
                user={user}
              />
            ))}
          </UserTileContainer>
        </BottomSheet>
      </FullMain>
      <BottomNavigation />
    </Container>
  )
}
