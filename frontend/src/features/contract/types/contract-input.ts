export type FormValue = string | number | boolean | null | undefined
export type FieldValue = FormValue

export interface FormValues {
  [key: string]: FormValue
}

export interface BaseInputProps {
  onChange: (value: FieldValue) => void
  isAfter: boolean
  item: string
}

export interface ValueInputProps extends BaseInputProps {
  value: FormValue
}

export interface CalendarInputProps extends BaseInputProps {
  value: FormValue
}

export type InputType =
  | 'moneyInputBox'
  | 'switch'
  | 'inputBox'
  | 'account'
  | 'calendar'
  | 'customPicker'
  | 'card'

export type InputComponentMap = {
  moneyInputBox: React.ComponentType<ValueInputProps>
  switch: React.ComponentType<ValueInputProps>
  inputBox: React.ComponentType<ValueInputProps>
  account: React.ComponentType<ValueInputProps>
  calendar: React.ComponentType<CalendarInputProps>
  customPicker: React.ComponentType<ValueInputProps>
  card: React.ComponentType<ValueInputProps>
}
