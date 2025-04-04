'use client'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Link from 'next/link'

import { getContract, getContractMembers } from '@/apis/group'
import { BottomNavigation, TopHeader } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setContract, setContractMembers } from '@/store/slices/contractSlice'
import { Container, FullMain } from '@/styles/styles'

export function ContractPage() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.user.user)
  const contract = useAppSelector((state) => state.contract.contract)
  const contractMembers = useAppSelector(
    (state) => state.contract.contractMembers,
  )
  const dispatch = useDispatch()

  const fetchContract = async () => {
    if (!user.contractId) return
    const response = await getContract(user.contractId)
    if (response.success) {
      dispatch(setContract(response.data))
    }
    const response2 = await getContractMembers(user.contractId)
    if (response2.success) {
      dispatch(setContractMembers(response2.data))
    }
  }

  useEffect(() => {
    fetchContract()
  }, [])

  return (
    <Container>
      <TopHeader title={t('contractPage')} />
      <FullMain>
        <Link href={`/contract/detail`}>
          <div>서약서 바로가기 </div>

          <div>
            {contractMembers &&
              contractMembers.map((member) => (
                <div key={member.id}>
                  {member.name}
                  approved: {member.approved ? 'true' : 'false'}
                  status: {member.status}
                </div>
              ))}
          </div>
        </Link>
      </FullMain>
      <BottomNavigation />
    </Container>
  )
}
