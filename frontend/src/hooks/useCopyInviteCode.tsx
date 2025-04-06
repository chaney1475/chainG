import { useCallback } from 'react'

export const useCopyInviteCode = (
  inviteCode: string,
  name: string,
  groupName: string,
) => {
  const shareData = {
    title: 'MDN',
    text: 'Learn web development on MDN!',
    url: 'https://developer.mozilla.org',
  }

  const btn = document.querySelector('button')
  const resultPara = document.querySelector('.result')

  // Share must be triggered by "user activation"

  // useCallback을 사용하여 클립보드에 복사하는 함수를 메모이제이션
  return useCallback(async () => {
    console.log('copyInviteCode 호출됨')
    const message = `[chainG] ${name}님이 ${groupName}에 초대했어요.
    초대코드 : ${inviteCode}
    링크 : https://chaing.site/group/join?inviteCode=${encodeURIComponent(inviteCode)}
    `
    navigator.clipboard.writeText(message)
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log(err)
    }
  }, [inviteCode, name, groupName])
}
