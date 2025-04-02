import { useState, useEffect } from 'react'

interface UseTimeSelectorProps {
  initialTime?: string
  initialUseTime?: boolean
  onTimeChange: (time: string) => void
}

export const useTimeSelector = ({
  initialTime = '',
  initialUseTime = false,
  onTimeChange,
}: UseTimeSelectorProps) => {
  const [isVisible, setIsVisible] = useState(initialUseTime)
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    if (!isVisible) {
      setTime('')
      onTimeChange('')
    }
  }, [isVisible, onTimeChange])

  useEffect(() => {
    if (initialTime) {
      setTime(initialTime)
    }
  }, [initialTime])

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    onTimeChange(newTime)
  }

  return {
    isVisible,
    setIsVisible,
    time,
    setTime: handleTimeChange,
  }
} 