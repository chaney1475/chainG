import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getLivingAccount } from '@/apis/livingBudget'
import { useAppSelector } from '@/hooks'
import {
  setLivingAccountNo,
  setMyAccountNo,
} from '@/store/slices/livingBudgetSlice'

import { DashBoard, LifeBudgetPreview, Notice } from '..'
import { Container, ContentsContainer } from './styles'

export function ConfirmedHomeContents() {
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.user.user)
  const livingBudget = useAppSelector((state) => state.livingBudget)

  const fetchAccount = useCallback(async () => {
    console.log('fetchAccount 호출됨', !user.contractId)
    if (!user.contractId) return
    if (!livingBudget.livingAccountNo || !livingBudget.myAccountNo) {
      const response = await getLivingAccount()
      if (response.success) {
        if (response.data.myAccountNo) {
          dispatch(setMyAccountNo(response.data.myAccountNo))
        }
        if (response.data.liveAccountNo) {
          dispatch(setLivingAccountNo(response.data.liveAccountNo))
        }
      }
    }
  }, [user.contractId, livingBudget, dispatch])

  useEffect(() => {
    fetchAccount()
  }, [user.contractId])
  return (
    <Container>
      <Notice />
      <ContentsContainer>
        <DashBoard />
        <LifeBudgetPreview />
      </ContentsContainer>
    </Container>
  )
}
