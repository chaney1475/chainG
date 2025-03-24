import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import ThemeRegistry from '@/components/ThemeRegistry'
import { paperlogyMedium, paperlogyRegular } from '@/styles/fonts'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Chain G',
  description: '계약과 약속 사이, 우리 집의 블록체인 계약서',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${paperlogyRegular.variable} ${paperlogyMedium.variable}`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
