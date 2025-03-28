export interface User {
  id: number
  name: string
  nickname: string | null
  profileImage: string | null
}

export interface UserSummary extends User {
  emailAddress: string
}

export interface LoginUser extends User {
  groupId: number | null
  contractId: number | null
}
