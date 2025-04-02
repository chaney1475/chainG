import { Rent } from '@/types/contract'

export type FormValue = Rent | string | number | boolean | null | undefined
export type FieldValue = FormValue

export interface FormValues {
  [key: string]: FormValue
}

export interface ValueInputProps {
  onChange: (value: FieldValue) => void
  isAfter: boolean
  item: string
  value: FormValue
  watch?: (field: string) => FormValue
}

export interface FormValuesInputProps extends ValueInputProps {
  formValues: FormValues
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
  moneyInputBox: React.ComponentType<FormValuesInputProps>
  switch: React.ComponentType<FormValuesInputProps>
  inputBox: React.ComponentType<ValueInputProps>
  account: React.ComponentType<ValueInputProps>
  calendar: React.ComponentType<ValueInputProps>
  customPicker: React.ComponentType<ValueInputProps>
  card: React.ComponentType<ValueInputProps>
}
