'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import {
  confirmContract,
  createEmptyContract,
  updateContract,
} from '@/apis/group'
import {
  ConfirmButton,
  IconButton,
  Modal,
  ProgressBar,
  UserItem,
} from '@/components'
import { HeaderButton } from '@/components/TopHeader/styles'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  updateContractRequestField,
  updateRent,
  validateContractRequest,
} from '@/store/slices/contractSlice'
import { setContract } from '@/store/slices/contractSlice'
import { setContractId } from '@/store/slices/userSlice'
import {
  BottomContainer,
  Container,
  FullMain,
  HeaderContainer,
  UserTileContainer,
} from '@/styles/styles'
import { ContractRequest } from '@/types/contract'

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
import { InputWrapper } from './components/InputWrapper'

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
  const router = useRouter()
  const group = useAppSelector((state) => state.group.group)
  const [openModal, setOpenModal] = useState(false)
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
  const user = useAppSelector((state) => state.user.user)
  useEffect(() => {
    const createContract = async () => {
      if (!user.contractId) {
        console.log('createContract', user)
        const response = await createEmptyContract({
          groupId: user.groupId as number,
        })
        if (response.success) {
          dispatch(setContractId(response.data.id))
        }
      }
    }
    createContract()
  }, [contractRequest])

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
      value: contractRequest[item as keyof ContractRequest],
      formValues: contractRequest,
      item,
    }
    return <Component {...valueProps} />
  }
  const validations = useAppSelector((state) => state.contract.validations)
  const [isFinalSubmit, setIsFinalSubmit] = useState(false)

  useEffect(() => {
    console.log('isFinalSubmit', isFinalSubmit)
    if (isFinalSubmit) {
      setOpenModal(true)
    }
  }, [isFinalSubmit])

  const handleUpdate = async () => {
    if (isValid) {
      setIsFinalSubmit(true)
      setShouldUpdate(true)
    }
  }
  useEffect(() => {
    dispatch(validateContractRequest())
  }, [contractRequest, dispatch])

  const handleModalConfirm = async () => {
    setOpenModal(false)
    setShouldUpdate(true)
  }
  const isValid = Object.values(validations).every((v) => v.isValid)
  const [shouldUpdate, setShouldUpdate] = useState(false)

  useEffect(() => {
    const handleDraft = async () => {
      if (shouldUpdate) {
        await draftContractRequest()
        setShouldUpdate(false)
      }
    }
    handleDraft()
  }, [shouldUpdate])

  const handleConfirm = () => (isLastStep ? handleUpdate() : handleNext())
  const handleDraft = async () => {
    setIsFinalSubmit(false)
    setOpenModal(true)
  }

  const draftContractRequest = async () => {
    setOpenModal(false)
    if (!user.contractId) {
      return
    }

    const response = await updateContract({
      contractId: user.contractId,
      contract: contractRequest,
    })
    if (response.success) {
      dispatch(setContract(response.data))
    }
    if (isFinalSubmit) {
      router.push('/contract/detail')
    }
  }

  const updateContractRequest = async () => {
    if (!user.contractId) {
      return
    }
    const response = await confirmContract({
      contractId: user.contractId,
      contract: contractRequest,
    })
    if (response.success) {
      dispatch(setContract(response.data))
      router.push('/contract/detail')
    }
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
        <HeaderButton onClick={handleDraft}>
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
              showName={true}
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
          onClick={handleConfirm}
          label={isLastStep ? t('finish') : t('next')}
          variant={isValid || !isLastStep ? 'next' : 'disabled'}
        />
      </BottomContainer>
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        onConfirm={handleModalConfirm}
        title={
          isFinalSubmit ? t('contract.update.title') : t('contract.draft.title')
        }
        description={
          isFinalSubmit
            ? t('contract.update.content')
            : t('contract.draft.content')
        }
      />
    </Container>
  )
}
