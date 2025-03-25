'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { Provider } from 'react-redux'

import createCache from '@emotion/cache'
import { ThemeProvider } from '@emotion/react'
import { CacheProvider } from '@emotion/react'
import { Store } from '@reduxjs/toolkit'
import { Persistor } from 'redux-persist'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import makeStore, { RootState } from '@/store/store'
import theme from '@/styles/themes'

import { I18nProvider } from './i18n-provider'

function EmotionProvider({ children }: PropsWithChildren) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css' })
    cache.compat = true
    return cache
  })

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  )
}

export function Providers({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false)
  const [store, setStore] = useState<Store<RootState> | null>(null)
  const [persistor, setPersistor] = useState<Persistor | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const newStore = makeStore()
        setStore(newStore)
        setPersistor(persistStore(newStore))
        setMounted(true)
      } catch (error) {
        console.error('Failed to initialize Redux store:', error)
        setError(
          error instanceof Error
            ? error
            : new Error('Store initialization failed'),
        )
      }
    }

    initializeStore()
  }, [])

  if (error) {
    return (
      <div>
        <h1>앱 초기화 중 오류가 발생했습니다</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </div>
    )
  }

  if (!mounted || !store || !persistor) {
    return (
      <EmotionProvider>
        <div>로딩 중...</div>
      </EmotionProvider>
    )
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={<div>로딩 중...</div>}
        persistor={persistor}>
        <EmotionProvider>
          <I18nProvider>{children}</I18nProvider>
        </EmotionProvider>
      </PersistGate>
    </Provider>
  )
}
