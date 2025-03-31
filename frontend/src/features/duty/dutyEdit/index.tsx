'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BottomSheet, ConfirmButton, TopHeader } from '@/components'
import { userList } from '@/constants/userList'

import { DutySelectContent } from './components/DutySelectContent'
import { DutySelector } from './components/DutySelector'
import { TaskSelector } from './components/TaskSelector'
import { TimeSelector } from './components/TimeSelector'
import { WeekSelector } from './components/WeekSelector'
import { BottomContainer, Container, FullMain } from './styles'

export function DutyEdit() {
  const { t } = useTranslation()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const handleSaveUsers = (selected: number[]) => {
    setSelectedUsers(selected)
    setIsBottomSheetOpen(false)
  }

  const sizeOfUserList = userList.length <= 4 ? userList.length : 4
  return (
    <Container>
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <WeekSelector />
        <TimeSelector />
        <TaskSelector />
        <DutySelector setIsBottomSheetOpen={setIsBottomSheetOpen} />
        <BottomSheet
          open={isBottomSheetOpen}
          onOpenChange={setIsBottomSheetOpen}
          snapPoints={{
            MIN: 0.1,
            MID: 29 / 100 + (9 / 92) * sizeOfUserList,
            MAX: 29 / 100 + (9 / 92) * sizeOfUserList,
          }}>
          <DutySelectContent
            userList={userList}
            selectedUsers={selectedUsers}
            onConfirm={handleSaveUsers}
          />
        </BottomSheet>
      </FullMain>
      <BottomContainer>
        <ConfirmButton label="저장" />
      </BottomContainer>
    </Container>
  )
}
