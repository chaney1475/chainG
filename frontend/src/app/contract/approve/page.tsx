'use client'

import { ContractDetail } from '@/features/contract/detail'

// 남들 승인용 페이지
// contract를  읽어야 함
export default ContractDetail

export const ContractStatus = {
  pending: 'pending',
} as const
