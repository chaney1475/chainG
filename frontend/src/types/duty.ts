import { dutyCategoryList } from '@/constants/dutyList'

export interface Duty {
  id: number
  title: string
  dutyTime: string
  dayOfWeek: string
  useTime: boolean
  assignees: number[]
  category: string
}

export interface DutyWeekList {
  sunday: Duty[]
  monday: Duty[]
  tuesday: Duty[]
  wednesday: Duty[]
  thursday: Duty[]
  friday: Duty[]
  saturday: Duty[]
}

export interface DutyCategory {
  id: string
  src: string
}

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
// 요일 타입 정의
