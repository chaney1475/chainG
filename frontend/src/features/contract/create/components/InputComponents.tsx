import { useDispatch } from 'react-redux'

import {
  AccountInput,
  Calendar,
  Card,
  CustomPicker,
  InputBox,
  MoneyInputBox,
  RentRatio,
} from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { updateRent } from '@/store/slices/contractSlice'

import {
  FormValuesInputProps,
  ValueInputProps,
} from '../../types/contract-input'

export const MoneyInput: React.FC<FormValuesInputProps> = () => {
  const dispatch = useDispatch()
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)

  return (
    <MoneyInputBox
      value={rent?.totalAmount ?? 0}
      onChange={(value: number) => {
        dispatch(
          updateRent({
            ...rent,
            totalAmount: value,
          }),
        )
      }}
    />
  )
}

export const SwitchInput: React.FC<FormValuesInputProps> = () => <RentRatio />

export const TextInput: React.FC<FormValuesInputProps> = () => {
  const dispatch = useDispatch()
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)

  return (
    <InputBox
      id="ownerAccountNo"
      value={rent?.ownerAccountNo ?? ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
          updateRent({
            ...rent,
            ownerAccountNo: e.target.value,
          }),
        )
      }}
    />
  )
}

export const AccountInputWrapper: React.FC<ValueInputProps> = (props) => (
  <AccountInput
    value={props.value ? String(props.value) : undefined}
    onChange={props.onChange}
    isConfirmed={props.isAfter}
    onConfirm={() => {}}
  />
)

export const CalendarInput: React.FC<ValueInputProps> = (props) => (
  <Calendar
    value={props.value ? new Date(props.value as string) : new Date()}
    onChange={(newDate) => {
      props.onChange(newDate?.toISOString() || '')
    }}
  />
)

export const CardInput: React.FC<ValueInputProps> = (props) => (
  <Card
    value={props.value ? String(props.value) : undefined}
    onChange={props.onChange}
    isConfirmed={props.isAfter}
    onConfirm={() => {}}
  />
)

export const CustomPickerInput: React.FC<FormValuesInputProps> = () => {
  const dispatch = useDispatch()
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)

  return (
    <CustomPicker
      handleChange={(value) => {
        dispatch(
          updateRent({
            ...rent,
            dueDate: Number(value.value),
          }),
        )
      }}
      pickerValue={{ value: rent?.dueDate ? String(rent.dueDate) : '' }}
      selections={{
        value: Array.from({ length: 31 }, (_, i) => String(i + 1)),
      }}
    />
  )
}
