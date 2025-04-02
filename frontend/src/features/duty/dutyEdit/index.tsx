'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { createDuty } from '@/apis/duty'
import { BottomSheet, TitleHeaderLayout } from '@/components'
// import { userList } from '@/constants/userList'
import { useAppSelector } from '@/hooks/useAppSelector'
import { DutyRequest } from '@/types/duty'

import useSelectWeek from '../hooks/useSelectWeek'
import { AssigneesSelectContent } from './components/AssigneesSelectContent'
import { AssigneesSelector } from './components/AssigneesSelector'
import { TimeSelector } from './components/TimeSelector'
import { TitleSelector } from './components/TitleSelector'
import { WeekSelector } from './components/WeekSelector'
import { FullMain } from './styles'

export function DutyEdit() {
  const { t } = useTranslation()
  const router = useRouter()

  const { selectedWeek, setSelectedWeek } = useSelectWeek()

  const methods = useForm<DutyRequest>({
    defaultValues: {
      title: '',
      category: 'RENT',
      dutyTime: '',
      dayOfWeek: selectedWeek,
      useTime: false,
      assignees: [],
    },
  })
  const { watch, handleSubmit, setValue } = methods

  const assignees = watch('assignees')
  const dutyTime = watch('dutyTime')

  useEffect(() => {
    setValue('dayOfWeek', selectedWeek)
  }, [selectedWeek, setValue])

  if (dutyTime !== '') {
    setValue('useTime', true)
  } else {
    setValue('useTime', false)
  }

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const group = useAppSelector((state) => state.group.group)
  const handleSaveUsers = (selected: number[]) => {
    setValue('assignees', selected)
    setIsBottomSheetOpen(false)
  }

  const userList = group.members
  const sizeOfUserList = userList.length <= 4 ? userList.length : 4 // BottomSheet 사이즈 제한

  const calculateMaxSnapPoint = () => {
    const windowHeight = window.innerHeight // 화면 높이
    const userListHeight = sizeOfUserList * 90 + 200 // 각 사용자 항목의 높이를 80px로 가정
    return Math.min(userListHeight / windowHeight, 0.9) // 최대 90%를 넘지 않도록 제한
  }

  const onSubmit = async (data: DutyRequest) => {
    console.log('data', data)
    const response = await createDuty(group.id, data)
    console.log(response)
    if (response.success) {
      console.log('success')
      router.push('/duty')
    } else {
      console.log('error')
    }
  }

  return (
    <FormProvider {...methods}>
      <TitleHeaderLayout
        title={t('duty.title')}
        description={t('duty.description')}
        label="저장"
        onClick={handleSubmit(onSubmit)}>
        <FullMain>
          <WeekSelector
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
          />
          <TimeSelector
            time={dutyTime}
            setTime={(time: string) => setValue('dutyTime', time)}
          />

          <TitleSelector />

          <AssigneesSelector
            setIsBottomSheetOpen={setIsBottomSheetOpen}
            assignees={assignees}
            userList={userList}
          />

          <BottomSheet
            open={isBottomSheetOpen}
            onOpenChange={setIsBottomSheetOpen}
            snapPoints={{
              MIN: 0.1,
              MID: calculateMaxSnapPoint(),
              MAX: calculateMaxSnapPoint(),
            }}>
            <AssigneesSelectContent
              userList={userList}
              assignees={assignees}
              onConfirm={handleSaveUsers}
            />
          </BottomSheet>
        </FullMain>
      </TitleHeaderLayout>
    </FormProvider>
  )
}
