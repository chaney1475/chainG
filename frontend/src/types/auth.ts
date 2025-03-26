export interface SocialLogin {
  accessToken: string | null
  expiresIn: number | null
  refreshToken: string | null
}

export interface signUpRequest {
  emailAddress: string | null
  password: string | null
  name: string | null
}

export interface AuthUserResponse {
  id: number
  name: string
  nickname: string | null
  profileImage: string | null
  groupId: number | null
  contractId: number | null
}
