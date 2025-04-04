'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { updateContract } from '@/apis/group'
import { ConfirmButton, IconButton, ProgressBar, UserItem } from '@/components'
import { HeaderButton } from '@/components/TopHeader/styles'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  updateContractRequestField,
  updateRent,
} from '@/store/slices/contractSlice'
import {
  BottomContainer,
  Container,
  FullMain,
  HeaderContainer,
  UserTileContainer,
} from '@/styles/styles'
import { ContractRequest } from '@/types/contract'

import { InputWrapper } from '../component/InputWrapper'
import { useContractSteps } from '../hooks/useContractSteps'
import {
  FieldValue,
  InputComponentMap,
  InputType,
} from '../types/contract-input'
import {
  AccountInputWrapper,
  CalendarInput,
  CardInput,
  CustomPickerInput,
  MoneyInput,
  SwitchInput,
  TextInput,
} from './components/InputComponents'

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
  const dispatch = useDispatch()
  const group = useAppSelector((state) => state.group.group)
  const contractRequest = useAppSelector(
    (state) => state.contract.contractRequest,
  )
  const rentAccountConfirm = useAppSelector(
    (state) => state.contract.rentAccountConfirm,
  )
  const cardConfirm = useAppSelector((state) => state.contract.cardConfirm)
  const {
    step,
    stepContent,
    currentStepContent,
    handleNext,
    handleBack,
    isLastStep,
  } = useContractSteps()
  const isAfter = (item: string) => {
    return item === 'rentAccountNo'
      ? rentAccountConfirm
      : item === 'utility'
        ? cardConfirm
        : false
  }
  const handleChange = (field: string, value: FieldValue) => {
    if (field === 'rent') {
      dispatch(updateRent(value as ContractRequest['rent']))
    } else {
      dispatch(
        updateContractRequestField({
          field: field as keyof ContractRequest,
          value: value as ContractRequest[keyof ContractRequest],
        }),
      )
    }
  }

  const renderInputComponent = (type: InputType, item: string) => {
    const Component = InputComponents[type]
    if (!Component) return null

    const valueProps = {
      onChange: (value: FieldValue) => handleChange(item, value),
      isAfter: false, // TODO: Redux에서 가져오도록 수정
      value: contractRequest[item as keyof ContractRequest],
      formValues: contractRequest,
      item,
    }
    return <Component {...valueProps} />
  }

  const onSubmit = async () => {
    console.log(contractRequest)
    const response = await updateContract({
      contractId: '5',
      contract: contractRequest,
    })
    console.log(response)
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
        <HeaderButton onClick={onSubmit}>
          <IconButton
            src="/icons/save.svg"
            alt={t('contract.draft.title')}
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
