'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useAppSelector } from '@/hooks/useAppSelector'

import { BoxContainer } from '../../../styles'
import {
  AmountContainer,
  ContentContainer,
  Periond,
  TextContainer,
  TopDescription,
} from './styles'

export function Payment() {
  const rentInfo = useAppSelector((state) => state.pledge.rent)
  const month = Number(
    rentInfo?.monthList[0]?.month.slice(5) ?? new Date().getMonth() + 1,
  )

  const year = new Date().getFullYear()
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  return (
    <>
      <BoxContainer>
        <ContentContainer>
          <TopDescription>월세 - 4월</TopDescription>
          <TextContainer>
            <AmountContainer>
              <Image
                src="/images/pledge/rentMoney.svg"
                alt="월세"
                width={24}
                height={24}
              />
              <div>{rentInfo?.totalAmount}원</div>
            </AmountContainer>
            <Periond>
              {' '}
              {firstDay.toLocaleDateString()} ~{' '}
              {lastDay.toLocaleDateString()}{' '}
            </Periond>
          </TextContainer>
        </ContentContainer>
      </BoxContainer>
    </>
  )
}
