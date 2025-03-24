'use client'

import { useState } from 'react'

import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'

import createEmotionCache from '@/lib/emotion'
import theme from '@/styles/themes'

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [cache] = useState(() => createEmotionCache())

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    )
  })

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  )
}
