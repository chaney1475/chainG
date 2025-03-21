'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { getFcmToken, onForegroundMessage } from './firebase'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const testValue = process.env.NEXT_PUBLIC_TEST_VALUE

  useEffect(() => {
    const initFirebase = async () => {
      await getFcmToken()
      onForegroundMessage()
    }

    initFirebase()
  }, [])

  useEffect(() => {
    // TODO: 실제 로그인 상태 체크 로직 구현
    const isLoggedIn = false // 임시로 false로 설정
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

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
