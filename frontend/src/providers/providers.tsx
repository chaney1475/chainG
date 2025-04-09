'use client'

import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import ErrorModal from '@/components/ErrorModal'
import { Main } from '@/features/home/HomePage/styles'
import { store } from '@/store/store'

import { EmotionProvider } from './emotionProvider'
import { I18nProvider } from './i18nProvider'

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100dvh',
        width: '100%',
      }}>
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60%',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          width: '100%',
          overflowY: 'auto',
        }}>
        <img
          src="/icons/loading.svg"
          alt="logo"
          width={100}
          height={100}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            textAlign: 'center',
            fontFamily: 'var(--font-paperlogy-medium)',
            color: 'var(--color-text-regular)',
          }}>
          <h1>Cha:nG</h1>
          <p>계약과 약속 사이</p>
          <p>우리 집의 블록체인 계약서</p>
        </div>
      </div>
    </div>
  )
}

export function Providers({ children }: PropsWithChildren) {
  const persistor = persistStore(store)

  return (
    <EmotionProvider>
      <Provider store={store}>
        <PersistGate
          loading={<LoadingFallback />}
          persistor={persistor}>
          <ErrorModal />
          <I18nProvider>{children}</I18nProvider>
        </PersistGate>
      </Provider>
    </EmotionProvider>
  )
}
