export interface Group {
  id: number
  name: string
  inviteCode: string
  leaderId: number
  maxParticipants: number
}
export interface JoinGroupsRequest {
  groupId: number
  nickname: string
  profileImage: string
}

export interface CreateGroupRequest {
  groupName: string
  maxParticipants: number
  ownerNickname: string
  ownerProfileImage: string
}
