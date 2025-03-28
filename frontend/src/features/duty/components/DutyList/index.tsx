'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { dutyList } from '@/constants/dutyList'

import { DutyListItem } from '../DutyListItem'
import { Container } from './styles'

export function DutyList() {
  return (
    <Container>
      {dutyList.monday.map((duty) => (
        <DutyListItem
          key={duty.id}
          duty={duty}
        />
      ))}
    </Container>
  )
}
