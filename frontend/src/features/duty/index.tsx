'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { getDuties } from '@/apis/duty'
import { TopHeader } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setDutyWeekList } from '@/store/slices/dutySlice'

import { DutyList } from './components/DutyList'
import { WeekList } from './components/WeekList'
import useSelectWeek from './hooks/useSelectWeek'
import { Container, FullMain, Navigator } from './styles'

export function DutyPage() {
  const { t } = useTranslation()
  const group = useAppSelector((state) => state.group.group) // 그룹정보 받아오는 커스텀 훅
  const dutyWeekList = useAppSelector((state) => state.duty.dutyWeekList)
  const dispatch = useDispatch()

  const { selectedWeek, setSelectedWeek } = useSelectWeek()

  useEffect(() => {
    const fetchDuties = async () => {
      const response = await getDuties(group.id) // dutyList
      console.log(response)
      if (response.success) {
        console.log('듀티 리스트', response.data)
        dispatch(setDutyWeekList(response.data))
      }
    }
    fetchDuties()
  }, [])

  return (
    <Container>
      <TopHeader title={t('duty.title')} />
      <FullMain>
        <WeekList
          dutyList={dutyWeekList}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
        <DutyList
          dutyList={dutyWeekList}
          selectedWeek={selectedWeek}
        />
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
