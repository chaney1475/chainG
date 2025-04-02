'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { getDuties } from '@/apis/duty'
import { BottomSheet, TopHeader } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setDutyWeekList } from '@/store/slices/dutySlice'

import { DutyList } from './components/DutyList'
import { EditOrDeleteDuty } from './components/EditOrDeleteDuty'
import { WeekList } from './components/WeekList'
import useSelectWeek from './hooks/useSelectWeek'
import { Container, FullMain, Navigator } from './styles'

export function DutyPage() {
  const { t } = useTranslation()
  const group = useAppSelector((state) => state.group.group) // 그룹정보 받아오는 커스텀 훅
  const dutyWeekList = useAppSelector((state) => state.duty.dutyWeekList)
  const dispatch = useDispatch()
  const userList = group.members

  const { selectedWeek, setSelectedWeek } = useSelectWeek()

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [selectedDutyId, setSelectedDutyId] = useState<number | null>(null)

  const calculateMaxSnapPoint = () => {
    const windowHeight = window.innerHeight // 화면 높이
    return Math.min((0.3 * 740) / windowHeight, 0.9) // 최대 90%를 넘지 않도록 제한
  }

  const handleSelectDuty = (dutyId: number) => {
    setSelectedDutyId(dutyId)
    setIsBottomSheetOpen(true)
  }

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
          userList={userList}
          onSelectDuty={handleSelectDuty}
        />
        <BottomSheet
          open={isBottomSheetOpen}
          onOpenChange={setIsBottomSheetOpen}
          snapPoints={{
            MIN: 0.1,
            MID: calculateMaxSnapPoint(),
            MAX: calculateMaxSnapPoint(),
          }}>
          <EditOrDeleteDuty selectedDutyId={selectedDutyId} />
        </BottomSheet>
      </FullMain>
      <Navigator></Navigator>
    </Container>
  )
}
