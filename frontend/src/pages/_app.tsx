import { Provider } from 'react-redux'

import { ThemeProvider } from '@emotion/react'
import type { AppProps } from 'next/app'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import theme from '@/styles/themes'

import { wrapper } from '../store/store'

function MyApp({ Component, pageProps }: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps)
  const persistor = persistStore(store)

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
