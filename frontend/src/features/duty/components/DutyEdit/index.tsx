import React, { useState } from 'react'

import { BottomSheet } from '@/components/BottomSheet'
import { DayKey } from '@/types/duty'

import { WeekSelector } from '../../WeekSelector'

interface WeekData {
  // weekData 타입 정의
}

const DutyEdit: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<DayKey>('monday')
  const [isOpen, setIsOpen] = useState(false)
  const [sizeOfUserList, setSizeOfUserList] = useState(0)
  const [weekData, setWeekData] = useState<WeekData[]>([])

  const calculateMaxSnapPoint = () => {
    const windowHeight = window.innerHeight
    const userListHeight = sizeOfUserList * 80 // 각 사용자 항목의 높이를 80px로 가정
    return Math.min(userListHeight / windowHeight, 0.9) // 최대 90%를 넘지 않도록 제한
  }

  const snapPoints = {
    MIN: 0.2,
    MID: 0.5,
    MAX: calculateMaxSnapPoint(),
  }

  return (
    <div>
      <WeekSelector
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weekData={weekData}
      />
      <BottomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        snapPoints={snapPoints}
        title="근무자 선택"></BottomSheet>
    </div>
  )
}

export default DutyEdit
