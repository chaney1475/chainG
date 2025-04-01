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
}
export interface SnapPoints {
  MIN: number
  MID: number
  MAX: number
}

export type MenuContent = {
  title: string
  onSelect: () => void
  color?: string
  disabled?: boolean
}
