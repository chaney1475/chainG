import { useMemo } from 'react'

import { formatTime } from '../utils/formatTime'

const useFormattedTime = (timestamp: number) =>
  useMemo(() => formatTime(timestamp), [timestamp])

export default useFormattedTime
