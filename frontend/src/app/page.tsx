import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
          <li>
            ChainG 인덱스 화면입니다. 로그인 상태면 로그인 페이지를 보여주고
            아니면 홈으로 이동합니다.
          </li>
        </ol>
      </main>
    </div>
  )
}
