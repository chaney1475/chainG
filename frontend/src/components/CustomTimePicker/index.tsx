'use client'

/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import { CustomPicker } from '../CustomPicker'
import { TimePickerContainer } from './style'

type PickerValue = {
  ampm: string
  hour: string
  minute: string
}

const selections: Record<keyof PickerValue, string[]> = {
  ampm: ['picker.am', 'picker.pm'],
  hour: Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')),
  minute: Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')),
}

const parseUTCTime = (utcTime: string): PickerValue => {
  const [hours, minutes] = utcTime.split(':').map(Number)
  const kstHours = (hours + 9) % 24 // UTC to KST conversion

  const isPM = kstHours >= 12
  const displayHours = kstHours % 12 || 12

  return {
    ampm: isPM ? 'picker.pm' : 'picker.am',
    hour: String(displayHours).padStart(2, '0'),
    minute: String(minutes).padStart(2, '0'),
  }
}

const convertToUTC = (pickerValue: PickerValue): string => {
  const { ampm, hour, minute } = pickerValue
  const hours = Number(hour)
  const minutes = Number(minute)
  let kstHours = ampm === 'picker.pm' ? hours + 12 : hours
  if (ampm === 'picker.pm' && hours === 12) kstHours = 12
  if (ampm === 'picker.am' && hours === 12) kstHours = 0

  const utcHours = (kstHours - 9 + 24) % 24 // KST to UTC conversion

  return `${String(utcHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}Z`
}
export const CustomTimePicker = ({
  time,
  setTime,
}: {
  time: string
  setTime: (time: string) => void
}) => {
  const [pickerValue, setPickerValue] = useState<PickerValue>(() =>
    parseUTCTime(time.replace('Z', '')),
  )
  useEffect(() => {
    setPickerValue(parseUTCTime(time.replace('Z', '')))
  }, [time])

  const handleChange = (value: PickerValue, key: string) => {
    const newPickerValue = {
      ...pickerValue,
      [key]: value[key as keyof PickerValue],
    }
    setPickerValue(newPickerValue)
    setTime(convertToUTC(newPickerValue))
  }

  return (
    <TimePickerContainer>
      <CustomPicker<PickerValue>
        handleChange={handleChange}
        pickerValue={pickerValue}
        selections={selections}
      />
    </TimePickerContainer>
  )
}
