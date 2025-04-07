'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { useRouter } from 'next/navigation'

import { BoxContainer } from '../../../styles'
import { ContentContainer } from './styles'

export function Graph() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <BoxContainer>
        <ContentContainer></ContentContainer>
      </BoxContainer>
    </>
  )
}
