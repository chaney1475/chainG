import { DutyCategory, DutyWeekList } from '@/types/duty'

export const dutyCategoryList: DutyCategory[] = [
  { id: 'clean', src: '/images/duty/duty-category-clean.png' },
  { id: 'trash', src: '/images/duty/duty-category-trash.png' },
]

export const dutyList: DutyWeekList = {
  sunday: [],
  monday: [
    {
      id: 1,
      title: '책상 정리 및 바닥 청소',
      dutyTime: '09:00Z',
      dayOfWeek: 'monday',
      useTime: true,
      assignees: [101, 102],
      category: 'clean',
    },
    {
      id: 2,
      title: '회의실 청소 및 화이트보드 정ㅓ거ㅐㅑ',
      dutyTime: '15:00Z',
      dayOfWeek: 'tuesday',
      useTime: true,
      assignees: [103],
      category: 'clean',
    },
    {
      id: 3,
      title: '휴게실과 복도 정리',
      dutyTime: '13:00Z',
      dayOfWeek: 'wednesday',
      useTime: false,
      assignees: [101, 104, 105],
      category: 'clean',
    },
  ],
  tuesday: [
    {
      id: 2,
      title: '회의실 청소 및 화이트보드 정리',
      dutyTime: '15:00Z',
      dayOfWeek: 'tuesday',
      useTime: true,
      assignees: [103],
      category: 'clean',
    },
  ],
  wednesday: [
    {
      id: 3,
      title: '휴게실과 복도 정리',
      dutyTime: '13:00Z',
      dayOfWeek: 'wednesday',
      useTime: false,
      assignees: [101, 104, 105],
      category: 'clean',
    },
  ],
  thursday: [],
  friday: [],
  saturday: [],
}
