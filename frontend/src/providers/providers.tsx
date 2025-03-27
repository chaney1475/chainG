'use client'

import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import ErrorModal from '@/components/ErrorModal'
import { store } from '@/store/store'

import { EmotionProvider } from './emotionProvider'
import { I18nProvider } from './i18nProvider'

function LoadingFallback() {
  return <div>로딩 중...</div>
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
