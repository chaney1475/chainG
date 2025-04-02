import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { InputType } from '../types/contract-input'

type StepContent = {
  [key: string]: InputType
}

const stepContent: StepContent[] = [
  {
    startDate: 'calendar',
    endDate: 'calendar',
  },
  {
    rent: 'moneyInputBox',
    totalRatio: 'switch',
  },
  {
    rentAccountNo: 'account',
  },
  {
    ownerAccountNo: 'inputBox',
    dueDate: 'customPicker',
  },
  {
    utility: 'card',
  },
]

export const useContractSteps = () => {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const handleNext = () => {
    setStep(Math.min(step + 1, stepContent.length - 1))
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const isFirstStep = step === 0
  const isLastStep = step === stepContent.length - 1
  const currentStepContent = stepContent[step]

  return {
    step,
    stepContent,
    currentStepContent,
    handleNext,
    handleBack,
    isFirstStep,
    isLastStep,
  }
}
