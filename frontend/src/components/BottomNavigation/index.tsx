'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { IconButton } from '@/components'
import { setSelectedNavItem } from '@/store/slices/uiSlice'
import { RootState } from '@/store/store'
import { NavItemVariant } from '@/types/nav'

import { Container, IconName, NavItem } from './styles'

export const BottomNavigation = () => {
  const dispatch = useDispatch()
  const selectedNavItem = useSelector(
    (state: RootState) => state.ui.selectedNavItem,
  )

  const { t } = useTranslation()

  const handleClick = (variant: NavItemVariant) => {
    dispatch(setSelectedNavItem(variant))
  }
  const navItems = Object.values(NavItemVariant) as NavItemVariant[]

  const isActive = (variant: NavItemVariant) => variant === selectedNavItem
  const getIconSrc = (variant: NavItemVariant) =>
    `/icons/nav/nav-${variant}-${isActive(variant) ? '' : 'in'}active.svg`
  return (
    <Container>
      {navItems.map((item) => {
        return (
          <NavItem
            key={item}
            onClick={() => handleClick(item)}
            isActive={isActive(item)}
            href={`/${item === 'home' ? '' : item}`}>
            <IconButton
              src={getIconSrc(item)}
              alt={t(item)}
            />
            <IconName>{t(item)}</IconName>
          </NavItem>
        )
      })}
    </Container>
  )
}
