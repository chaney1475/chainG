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
