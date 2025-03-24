import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useRouter } from 'next/router'

import { getFcmToken, onForegroundMessage } from '@/app/firebase'
import styles from '@/app/page.module.css'
import { RootState } from '@/store/store'

export default function Home() {
  const router = useRouter()
  const testValue = process.env.NEXT_PUBLIC_TEST_VALUE
  const accessToken = useSelector(
    (state: RootState) => state.auth.loginToken.accessToken,
  )

  useEffect(() => {
    const initFirebase = async () => {
      await getFcmToken()
      onForegroundMessage()
    }

    initFirebase()
  }, [])

  useEffect(() => {
    if (!accessToken) {
      router.push('/login')
    }
  }, [accessToken, router])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
          <li>
            ChainG 인덱스 화면입니다. 로그인 상태면 로그인 페이지를 보여주고
            아니면 홈으로 이동합니다. testValue 변수의 값은 {testValue}입니다.
          </li>
        </ol>
      </main>
    </div>
  )
}
