'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  AccountInput,
  Calendar,
  Card,
  ConfirmButton,
  CustomPicker,
  IconButton,
  InputBox,
  MoneyInputBox,
  ProgressBar,
  RentRatio,
} from '@/components'
import { UserItem } from '@/components'
import { HeaderButton } from '@/components/TopHeader/styles'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  BottomContainer,
  Container,
  FullMain,
  HeaderContainer,
  UserTileContainer,
} from '@/styles/styles'
import { ContractRequest, Rent, Utility } from '@/types/contract'

import { InputWrapper } from '../component/InputWrapper'
import { useContractSteps } from '../hooks/useContractSteps'
import {
  FieldValue,
  FormValues,
  InputComponentMap,
  InputType,
  ValueInputProps,
} from '../types/contract-input'

const MoneyInput: React.FC<ValueInputProps> = (props) => (
  <MoneyInputBox
    value={props.value ? Number(props.value) : 0}
    onChange={props.onChange}
  />
)

const SwitchInput: React.FC<ValueInputProps> = (props) => (
  <RentRatio
    checked={props.value ? Boolean(props.value) : false}
    onChange={props.onChange}
  />
)

const TextInput: React.FC<ValueInputProps> = (props) => (
  <InputBox
    id={props.item}
    value={props.value ? String(props.value) : undefined}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      props.onChange(e.target.value)
    }
  />
)

const AccountInputWrapper: React.FC<ValueInputProps> = (props) => (
  <AccountInput
    value={props.value ? String(props.value) : undefined}
    onChange={props.onChange}
    isConfirmed={props.isAfter}
    onConfirm={() => {}}
  />
)

const CalendarInput: React.FC<ValueInputProps> = (props) => (
  <Calendar
    value={props.value ? new Date(props.value as string) : new Date()}
    onChange={(newDate) => {
      props.onChange(newDate?.toISOString() || '')
    }}
  />
)
const CardInput: React.FC<ValueInputProps> = (props) => (
  <Card
    selected={props.value ? Boolean(props.value) : false}
    onSelect={() => props.onChange(!props.value)}
  />
)

const CustomPickerInput: React.FC<ValueInputProps> = (props) => (
  <CustomPicker
    handleChange={(value) => props.onChange(Number(value.value))}
    pickerValue={{ value: props.value ? String(props.value) : '' }}
    selections={{
      value: Array.from({ length: 31 }, (_, i) => String(i + 1)),
    }}
  />
)

const InputComponents: InputComponentMap = {
  moneyInputBox: MoneyInput,
  switch: SwitchInput,
  inputBox: TextInput,
  account: AccountInputWrapper,
  calendar: CalendarInput,
  customPicker: CustomPickerInput,
  card: CardInput,
}

export function ContractCreatePage() {
  const { t } = useTranslation()
  const contractRequest = useAppSelector(
    (state) => state.contract.contractRequest,
  )
  const { handleSubmit, watch, setValue } = useForm<ContractRequest>({
    defaultValues: contractRequest,
  })

  const {
    step,
    stepContent,
    currentStepContent,
    handleNext,
    handleBack,
    isLastStep,
  } = useContractSteps()

  const [rentAccountConfirm, setRentAccountConfirm] = useState(false)
  const [cardConfirm, setCardConfirm] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>({
    startDate: watch('startDate'),
    endDate: watch('endDate'),
    rent: watch('rent.totalAmount'),
    totalRatio: watch('rent.totalRatio'),
    rentAccountNo: watch('rent.rentAccountNo'),
    ownerAccountNo: watch('rent.ownerAccountNo'),
    dueDate: watch('rent.dueDate'),
    utility: watch('utility.cardId'),
  })

  const group = useAppSelector((state) => state.group.group)

  const handleChange = (field: string, value: FieldValue) => {
    setFormValues((prev: FormValues) => ({
      ...prev,
      [field]: value,
    }))

    switch (field) {
      case 'startDate':
        setValue('startDate', value as string)
        break
      case 'endDate':
        setValue('endDate', value as string)
        break
      case 'rent':
        setValue('rent.totalAmount', value as number)
        break
      case 'rent.totalRatio':
        setValue('rent.totalRatio', value as number)
        break
      case 'rent.rentAccountNo':
        setValue('rent.rentAccountNo', value as string)
        setRentAccountConfirm(true)
        break
      case 'rent.ownerAccountNo':
        setValue('rent.ownerAccountNo', value as string)
        break
      case 'rent.dueDate':
        setValue('rent.dueDate', value as number)
        break
      case 'utility.cardId':
        setValue('utility.cardId', value as number | null)
        setCardConfirm(true)
        break
      default:
        setValue(
          field as keyof ContractRequest,
          value as string | Rent | Utility,
        )
    }
  }

  const isAfter = (type: string) => {
    if (type === 'account') return rentAccountConfirm
    if (type === 'card') return cardConfirm
    return false
  }

  const renderInputComponent = (type: InputType, item: string) => {
    const Component = InputComponents[type]
    if (!Component) return null

    const valueProps = {
      onChange: (value: FieldValue) => handleChange(item, value),
      isAfter: isAfter(item),
      value: formValues[item],
      item,
    }

    switch (type) {
      case 'moneyInputBox':
        return <MoneyInput {...valueProps} />
      case 'switch':
        return <SwitchInput {...valueProps} />
      case 'inputBox':
        return <TextInput {...valueProps} />
      case 'account':
        return <AccountInputWrapper {...valueProps} />
      case 'customPicker':
        return <CustomPickerInput {...valueProps} />
      case 'card':
        return <CardInput {...valueProps} />
      case 'calendar':
        return <CalendarInput {...valueProps} />
      default:
        return null
    }
  }

  const onSubmit = async (data: ContractRequest) => {
    console.log(data)
  }

  return (
    <Container>
      <HeaderContainer>
        <HeaderButton onClick={handleBack}>
          <IconButton
            src="/icons/arrow-left.svg"
            alt={t('icon.back')}
            onClick={handleBack}
          />
        </HeaderButton>
        {t('contract.title')}
        <HeaderButton onClick={handleBack}>
          <IconButton
            src="/icons/save.svg"
            alt={t('contract.draft.title')}
            onClick={handleSubmit(onSubmit)}
          />
        </HeaderButton>
      </HeaderContainer>
      <HeaderContainer>
        <ProgressBar
          step={step}
          steps={stepContent.length}
        />
      </HeaderContainer>
      <HeaderContainer>
        <UserTileContainer>
          {group?.members.map((user) => (
            <UserItem
              key={user.id}
              user={user}
            />
          ))}
        </UserTileContainer>
      </HeaderContainer>
      <FullMain>
        {Object.entries(currentStepContent).map(([item, type]) => (
          <InputWrapper
            key={item}
            id={item}
            isAfter={isAfter(item)}>
            {renderInputComponent(type, item)}
          </InputWrapper>
        ))}
      </FullMain>
      <BottomContainer>
        <ConfirmButton
          onClick={handleNext}
          label={isLastStep ? t('finish') : t('next')}
        />
      </BottomContainer>
    </Container>
  )
}
