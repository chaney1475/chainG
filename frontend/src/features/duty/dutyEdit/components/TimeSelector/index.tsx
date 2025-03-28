'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { InputBox } from '@/components'
import '@/styles/styles'

import { Container } from './styles'

export function TimeSelector() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Container>
      <div> {t(`duty.edit.time.title`)} </div>
    </Container>
  )
}
