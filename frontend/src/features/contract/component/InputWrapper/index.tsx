'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Title } from '@/styles/styles'

import { InputContainer, Label } from './styles'

interface InputBoxProps {
  id: string
  isAfter: boolean
  children?: React.ReactNode
}

export const InputWrapper = ({ id, isAfter, children }: InputBoxProps) => {
  const [label, setLabel] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (!id) return
    const labelText = `contract.${id}.${isAfter ? 'afterLabel' : 'label'}`
    const titleText = `contract.${id}.title`
    setLabel(i18n.exists(labelText) ? t(labelText) : '')
    setTitle(i18n.exists(titleText) ? t(titleText) : '')
  }, [id, isAfter])

  return (
    <InputContainer>
      {title && <Title>{title}</Title>}
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
    </InputContainer>
  )
}
