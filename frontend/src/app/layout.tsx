// src/app/layout.tsx
import { ClientProvider } from '@/providers/clientProvider'
import { fontVariables } from '@/styles/fonts'

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={fontVariables}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  )
}
