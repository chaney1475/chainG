import { DutyCategory, DutyWeekList } from '@/types/duty'

export const dutyCategoryList: DutyCategory[] = [
  { id: 'CLEAN', src: '/images/duty/duty-category-clean.png' },
  { id: 'COOKING', src: '/images/duty/duty-category-cooking.png' },
  { id: 'SHOPPING', src: '/images/duty/duty-category-shopping.png' },
  { id: 'MAINTENANCE', src: '/images/duty/duty-category-maintenance.png' },
  { id: 'GARBAGE', src: '/images/duty/duty-category-garbage.png' },
  { id: 'LAUNDRY', src: '/images/duty/duty-category-laundry.png' },
  { id: 'PET_CARE', src: '/images/duty/duty-category-pet-care.png' },
  { id: 'PLANT_CARE', src: '/images/duty/duty-category-plant-care.png' },
  { id: 'SETTLEMENT', src: '/images/duty/duty-category-settlement.png' },
  { id: 'OTHER', src: '/images/duty/duty-category-other.png' },
]

export const dutyWeekList: DutyWeekList = {
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
      dayOfWeek: 'monday',
      useTime: true,
      assignees: [103],
      category: 'clean',
    },
    {
      id: 3,
      title: '휴게실과 복도 정리',
      dutyTime: '13:00Z',
      dayOfWeek: 'monday',
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
  sunday: [],
}
