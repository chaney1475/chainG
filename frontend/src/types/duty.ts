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
  monday: Duty[]
  tuesday: Duty[]
  wednesday: Duty[]
  thursday: Duty[]
  friday: Duty[]
  saturday: Duty[]
  sunday: Duty[]
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

export type SelectorVariant = 'select' | 'sunday' | 'saturday' | 'default'
