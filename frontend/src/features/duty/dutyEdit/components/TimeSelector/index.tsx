'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ToggleSwitch } from '@/components'
import '@/styles/styles'
import { SwitcherContainer } from '@/styles/styles'

import { TimeInputContainer } from '../TimeInputContainer'
import { Container, TimeSwitcherContainer } from './styles'

export function TimeSelector() {
  const { t } = useTranslation()
  // const [isOn, setIsOn] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Container>
      <TimeSwitcherContainer>
        <SwitcherContainer>
          <div> {t(`duty.edit.time.title`)} </div>
          <ToggleSwitch
            isOn={isVisible}
            setIsOn={setIsVisible}
          />
        </SwitcherContainer>
      </TimeSwitcherContainer>
      {isVisible && <TimeInputContainer />}
    </Container>
  )
}
