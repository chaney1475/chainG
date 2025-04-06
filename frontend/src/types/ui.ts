export interface ValidationItem {
  isValid: boolean
  message: string
}

export const ButtonVariant = {
  next: 'next',
  disabled: 'disabled',
  prev: 'prev',
} as const

export type ButtonVariant = 'next' | 'disabled' | 'prev' | 'reject' | 'approve'

export interface CardItem {
  url: string
  image: string
  title: string
  description: string
  children?: React.ReactNode
}
export interface SnapPoints {
  MIN: number
  MID: number
  MAX: number
}

export interface Menu {
  id: string
  name: string
}

export type MenuContent = {
  title: string
  onSelect: () => void
  color?: string
  disabled?: boolean
}

export interface ProgressBarProps {
  step: number
  steps: number
}

export type PledgeMenu = 'contract' | 'account' | 'rent' | 'utility'
export type LivingMenu = 'calendar' | 'history'