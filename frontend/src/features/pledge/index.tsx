'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { BottomNavigation, TopHeader } from '@/components'

import { FloatingSwitchMenu } from '@/components'
import { PledgeMenuList } from '@/constants/FloatingSwitchMenu'
import { PledgeMenu } from '@/types/ui'
import { Container,FullMain } from './styles'
import { retrieveRent, retrieveUtility } from '@/apis/payment'
import { setRent, setUtility } from '@/store/slices/plegeSlice'
import { useAppSelector } from '@/hooks/useAppSelector'
import { RentPage } from './rent'
import { UtilityPage } from './utility'
import { getContract } from '@/apis/group'
import { setContract } from '@/store/slices/contractSlice'
import { ContractDetail } from './contract'

export function PledgePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const rentInfo = useAppSelector((state) => state.pledge.rent)
  const utilityInfo = useAppSelector((state) => state.pledge.utility)
  const contract = useAppSelector((state) => state.contract.contract)
  const user = useAppSelector((state) => state.user.user)
  


  // retrieveRent 월세 월별 통계 조회
  useEffect(() => {
    if (!rentInfo){
      const fetchRent = async () => {
        const response = await retrieveRent('2025-04')
        if (response.success) {
          dispatch(setRent(response.data))
          console.log('rent', response.data)
        }
      }
      fetchRent()
    } 
  }, [rentInfo, dispatch])

  useEffect(() => {
    if (!utilityInfo){
      const fetchUtility = async () => {
        
      const response = await retrieveUtility('2025-04')
      if (response.success) {
        dispatch(setUtility(response.data))
        console.log('utility', response.data)
      }
      }
      fetchUtility()
    }
  }, [utilityInfo, dispatch])


  useEffect(() => {
    const fetchContract =  async () => {
      if (!contract){
        if (user.contractId) {
          const response = await getContract(user.contractId)
          if (response.success) {
          dispatch(setContract(response.data))
        }
      }
    }
    fetchContract()
  } 
  }, [contract, user.contractId, dispatch])

  const menuList = PledgeMenuList
  const [menu, setMenu] = useState<PledgeMenu>('contract')
  return (
    <Container variant={menu}>
         <TopHeader title={'서약 관리'}/>
         <FullMain>
          {menu === 'contract' && <ContractDetail/>}
          {menu === 'account' && <div>account</div>}
        {menu === 'rent' && <RentPage/>}
        {menu === 'utility' && <UtilityPage/>}
        <FloatingSwitchMenu
        selectedMenu={menu}
        onSwitch={(menu) => setMenu(menu as PledgeMenu)}
        menuList={menuList}
      />
      </FullMain>

      <BottomNavigation />
    </Container>
  )
}
