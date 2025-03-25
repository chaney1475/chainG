'use client'

import { Suspense } from 'react'

import dynamic from 'next/dynamic'

const ClientWrapper = dynamic(() => import('@/providers/clientProvider'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

export default function ClientWrapperComponent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper>{children}</ClientWrapper>
    </Suspense>
  )
}
