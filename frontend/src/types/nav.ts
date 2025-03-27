export const NavItemVariant = {
  home: 'home',
  contract: 'contract',
  my: 'my',
} as const

export type NavItemVariant = keyof typeof NavItemVariant
