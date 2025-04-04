export const NavItemVariant = {
  home: 'homePage',
  contract: 'contractPage',
  my: 'myPage',
} as const

export type NavItemVariant = keyof typeof NavItemVariant
