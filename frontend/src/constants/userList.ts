export interface User {
  id: number
  name: string
  nickname: string | null
  profileImage: string | null
}

export const userList: User[] = [
  {
    id: 101,
    name: 'John Doe',
    nickname: '배고파',
    profileImage: '/images/profile/user1.png',
  },
  {
    id: 102,
    name: 'Jane Doe2',
    nickname: '싹싹김치',
    profileImage: '/images/profile/user2.png',
  },
  {
    id: 103,
    name: 'John Doe3',
    nickname: '김현래에요',
    profileImage: '/images/profile/user3.png',
  },
  {
    id: 104,
    name: 'John Doe4',
    nickname: '칠가이욥',
    profileImage: '/images/profile/user4.png',
  },
]
