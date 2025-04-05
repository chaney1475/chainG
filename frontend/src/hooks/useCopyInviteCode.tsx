import { useCallback } from 'react'

export const useCopyInviteCode = (
  inviteCode: string,
  name: string,
  groupName: string,
) => {
  // useCallback을 사용하여 클립보드에 복사하는 함수를 메모이제이션
  return useCallback(() => {
    console.log('copyInviteCode 호출됨')
    const message = `[chainG] ${name}님이 ${groupName}에 초대했어요.
    초대코드 : ${inviteCode}
    링크 : https://chaing.site/group/join?inviteCode=${encodeURIComponent(inviteCode)}
    `
    navigator.clipboard.writeText(message)
  }, [inviteCode, name, groupName])
}
