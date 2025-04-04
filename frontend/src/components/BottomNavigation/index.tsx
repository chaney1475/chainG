'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { IconButton } from '@/components'
import { setSelectedNavItem } from '@/store/slices/uiSlice'
import { RootState } from '@/store/store'
import { NavItemKey, NavItemVariant } from '@/types/nav'

import { Container, IconName, NavItem } from './styles'

export const BottomNavigation = () => {
  const dispatch = useDispatch()
  const selectedNavItem = useSelector(
    (state: RootState) => state.ui.selectedNavItem,
  )

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
          <NavItem
            key={key}
            onClick={() => handleClick(variant)}
            isActive={isActive(variant)}
            href={`/${key === 'home' ? '' : key}`}>
            <IconButton
              src={getIconSrc(key)}
              alt={t(variant)}
            />
            <IconName>{t(variant)}</IconName>
          </NavItem>
        )
      })}
    </Container>
  )
}
