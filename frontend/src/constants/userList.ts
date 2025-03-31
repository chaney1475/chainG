export interface User {
  id: number
  name: string
  nickname: string | null
  profileImage: string | null
}

export const userList: User[] = [
  {
    id: 1,
    name: 'John Doe',
    nickname: 'John',
    profileImage: '/images/profile/user1.png',
  },
  {
    id: 2,
    name: 'Jane Doe2',
    nickname: 'Jane',
    profileImage: '/images/profile/user2.png',
  },
  {
    id: 3,
    name: 'John Doe3',
    nickname: 'John3',
    profileImage: '/images/profile/user3.png',
  },
  {
    id: 3,
    name: 'John Doe3',
    nickname: 'John3',
    profileImage: '/images/profile/user3.png',
  },
  {
    id: 3,
    name: 'John Doe3',
    nickname: 'John3',
    profileImage: '/images/profile/user3.png',
  },
]
