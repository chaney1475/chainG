'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getGroup } from '@/apis/group'
import { getLivingAccount } from '@/apis/livingBudget'
import { getUnreadNotificationCount } from '@/apis/notification'
import { getHomeOverview } from '@/apis/user'
import { CardButton, IconButton, UserItem } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setGroup } from '@/store/slices/groupSlice'
import {
  setLivingAccountNo,
  setMyAccountNo,
} from '@/store/slices/livingBudgetSlice'
import { setHomeOverview } from '@/store/slices/userSlice'
import {
  Container,
  ImageContainer,
  Main,
  UserTileContainer,
} from '@/styles/styles'
import { ContractStatus } from '@/types/contract'
import { CardItem } from '@/types/ui'

import { HomeLayout } from '../components/HomeLayout'
import { Description, GroupName } from './styles'

export function HomePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const contract = useAppSelector((state) => state.contract.contract)
  const [contractStatus, setContractStatus] = useState<ContractStatus>(
    contract.status,
  )

  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const accessToken = useAppSelector(
    (state) => state.auth.loginToken.accessToken,
  )
  const user = useAppSelector((state) => state.user.user)
  const group = useAppSelector((state) => state.group.group)
  const livingBudget = useAppSelector((state) => state.livingBudget)
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!user.id) return

    const fetchHomeOverView = async () => {
      const response = await getHomeOverview()
      if (response.success) {
        dispatch(setHomeOverview(response.data))
      }
    }
    fetchHomeOverView()

    const fetchAccount = async () => {
      if (livingBudget.livingAccountNo) {
        const response = await getLivingAccount()
        if (response.success) {
          dispatch(setMyAccountNo(response.data.myAccountNo))
          dispatch(setLivingAccountNo(response.data.liveAccountNo))
        }
      }
    }
    fetchAccount()

    console.log('유저', user)
    const fetchUnreadNotificationCount = async () => {
      const response = await getUnreadNotificationCount(user.id)
      if (response.success) {
        console.log('response.data.count', response.data.count)
        setHasUnreadNotification(response.data.count > 0)
      }
    }
    fetchUnreadNotificationCount()

    if (!user.groupId) {
      router.push('/onboarding')
    }
    if (!user.contractId) {
      setContractStatus(ContractStatus.none)
    }
  }, [user, router, livingBudget.livingAccountNo])

  useEffect(() => {
    const fetchGroup = async () => {
      if (user.groupId == null || user.groupId === 0) return
      const response = await getGroup(user.groupId)
      if (response.success) {
        dispatch(setGroup(response.data))
      }
    }
    fetchGroup()
  }, [user.groupId, dispatch])

  useEffect(() => {
    if (!isMounted) return

    if (!accessToken) {
      router.push('/auth/login')
      return
    }
  }, [accessToken, router, isMounted])

  useEffect(() => {
    console.log('카드 생성을 해야 해요 ', user.contractId, contract.status)
  }, [user.contractId, contract.status])

  const cardItems: CardItem[] = [
    {
      url: '/contract/create',
      image: '/images/group/group-create.svg',
      title: '서약서 생성하기',
      description: t('onboarding.create.description'),
    },
    {
      url: '/group/join',
      image: '/images/group/group-join.svg',
      title: t('onboarding.join.title'),
      description: t('onboarding.join.description'),
    },
  ]

  if (!isMounted) {
    return null
  }

  if (!accessToken) {
    return (
      <Container>
        <Main>
          <h1>로고</h1>
          <p>캐치 프라이즈</p>
        </Main>
      </Container>
    )
  }

  return (
    <HomeLayout
      header="ChainG"
      headerRightButton={
        <IconButton
          onClick={() => router.push('/notification')}
          src={
            hasUnreadNotification
              ? '/icons/notice-active.svg'
              : '/icons/notice-inactive.svg'
          }
          alt={t('notice.title')}
        />
      }>
      <GroupName>{group.name}</GroupName>

      <Description>{group.name}</Description>
      <p>입주 준비중이에요 </p>

      <ImageContainer>
        <Image
          src="/images/home/home-main.png"
          alt="home-main"
          width={300}
          height={300}
          style={{ objectFit: 'cover' }}
        />
      </ImageContainer>

      <UserTileContainer>
        {group?.members &&
          group.members.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              variant="tile"
              size="medium"
            />
          ))}
      </UserTileContainer>

      <CardButton cardItems={cardItems}></CardButton>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
      <p>nickname: {user.nickname}</p>
      <p>profileImage: {user.profileImage}</p>
      <p>groupId: {user.groupId}</p>
      <p>contractId: {user.contractId}</p>
      {contractStatus}
    </HomeLayout>
  )
}
