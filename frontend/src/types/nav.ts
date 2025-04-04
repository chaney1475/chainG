export const NavItemVariant = {
  home: 'homePage',
  contract: 'contractPage',
  my: 'myPage',
} as const

export type NavItemKey = keyof typeof NavItemVariant // 'home' | 'contract' | 'my'
export type NavItemVariant = (typeof NavItemVariant)[NavItemKey] // 'homePage' | ...
