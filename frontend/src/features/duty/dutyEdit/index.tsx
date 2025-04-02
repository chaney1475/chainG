'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { createDuty, modifyDuty } from '@/apis/duty'
import { BottomSheet, TitleHeaderLayout } from '@/components'
// import { userList } from '@/constants/userList'
import { useAppSelector } from '@/hooks/useAppSelector'
import { DayKey, DutyRequest } from '@/types/duty'

import useSelectWeek from '../hooks/useSelectWeek'
import { AssigneesSelectContent } from './components/AssigneesSelectContent'
import { AssigneesSelector } from './components/AssigneesSelector'
import { TimeSelector } from './components/TimeSelector'
import { TitleSelector } from './components/TitleSelector'
import { WeekSelector } from './components/WeekSelector'
import { FullMain } from './styles'
import { useDispatch } from 'react-redux'
import { clearEditDuty, clearCreateDayOfWeek } from '@/store/slices/dutySlice'
export function DutyEdit() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

  const editDuty = useAppSelector((state) => state.duty.editDuty)
  const createDayOfWeek = useAppSelector((state) => state.duty.createDayOfWeek)
  const isEditMode = !!editDuty 
  console.log('isEditMode 1111111', isEditMode)

  useEffect(() => {
    return () => {
      dispatch(clearEditDuty())
      dispatch(clearCreateDayOfWeek())
    }
  }, [dispatch]) // 페이지 unMount 시 EditDuty 비워주기

  const { selectedWeek, setSelectedWeek } = useSelectWeek(
     createDayOfWeek || undefined
  )

  const methods = useForm<DutyRequest>({
    defaultValues: {
      title: editDuty?.title || '',
      category: editDuty?.category || 'RENT',
      dutyTime: editDuty?.dutyTime || '',
      dayOfWeek: editDuty?.dayOfWeek || selectedWeek,
      useTime: editDuty?.useTime || false,
      assignees: editDuty?.assignees || [],
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
    console.log('isEditMode', isEditMode)
    if(isEditMode){
      console.log('==========수정요청보냄============')
      const response = await modifyDuty(editDuty.id, data)
      console.log(response)
      if (response.success) {
        console.log('success')
        router.push('/duty')
      } else {
        console.log('error')
      }
    }
    else{
      console.log('==========생성요청보냄============')

    const response = await createDuty(group.id, data)
    console.log(response)
    if (response.success) {
      console.log('success')
      router.push('/duty')
    } else {
      console.log('error')
    }
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
            useTime={editDuty?.useTime || false}
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
