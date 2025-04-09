'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { IconButton } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setSelectedNavItem } from '@/store/slices/uiSlice'
import { RootState } from '@/store/store'
import { ContractStatus } from '@/types/contract'
import { NavItemKey, NavItemVariant } from '@/types/nav'

import { Container, IconName, NavItem } from './styles'

export const BottomNavigation = () => {
  const dispatch = useDispatch()
  const selectedNavItem = useSelector(
    (state: RootState) => state.ui.selectedNavItem,
  )
  const contract = useAppSelector((state) => state.contract.contract)
  const { t } = useTranslation()

  const handleClick = (variant: (typeof NavItemVariant)[NavItemKey]) => {
    dispatch(setSelectedNavItem(variant))
  }

  const navKeys = Object.keys(NavItemVariant) as NavItemKey[]

  const isActive = (variant: (typeof NavItemVariant)[NavItemKey]) =>
    variant === selectedNavItem

  const getIconSrc = (variant: NavItemKey) =>
    `/icons/nav/nav-${variant}-${isActive(NavItemVariant[variant]) ? '' : 'in'}active.svg`

  return (
    <Container>
      {navKeys.map((key) => {
        const variant = NavItemVariant[key]
        return (
          <React.Fragment key={key}>
            {(contract.status === ContractStatus.confirmed ||
              key != 'pledge') && (
              <NavItem
                onClick={() => handleClick(variant)}
                isActive={isActive(variant)}
                href={`/${key === 'home' ? '' : key}`}>
                <IconButton
                  src={getIconSrc(key)}
                  alt={t(variant)}
                />
                <IconName>{t(variant)}</IconName>
              </NavItem>
            )}
          </React.Fragment>
        )
      })}
    </Container>
  )
}
