export interface ValidationItem {
  isValid: boolean
  message: string
}

export const ButtonVariant = {
  next: 'next',
  disabled: 'disabled',
  prev: 'prev',
} as const

export type ButtonVariant = keyof typeof ButtonVariant

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
