'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getContract, getContractMembers, getGroup } from '@/apis/group'
import { getLivingAccount } from '@/apis/livingBudget'
import { getUnreadNotificationCount } from '@/apis/notification'
import { getHomeOverview } from '@/apis/user'
import { CardButton, IconButton, UserItem } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import useCopyInviteCode from '@/hooks/useCopyInviteCode'
import { setContract, setContractMembers } from '@/store/slices/contractSlice'
import { setGroup } from '@/store/slices/groupSlice'
import {
  setLivingAccountNo,
  setMyAccountNo,
} from '@/store/slices/livingBudgetSlice'
import { setHomeOverview } from '@/store/slices/userSlice'
import {
  Container,
  Title,
  TitleContainer,
  UserTileContainer,
} from '@/styles/styles'
import { ContractStatus } from '@/types/contract'
import { CardItem } from '@/types/ui'

import { DashBoard } from '../components/DashBoard'
import { HomeLayout } from '../components/HomeLayout'
import { LifeBudgetPreview } from '../components/LifeBudgetPreview'
import { Description, GroupName, ImageContainer, Main } from './styles'

export function HomePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const contract = useAppSelector((state) => state.contract.contract)
  const [status, setStatus] = useState<ContractStatus>(contract.status)
  const homeOverview = useAppSelector((state) => state.user.homeOverview)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const accessToken = useAppSelector(
    (state) => state.auth.loginToken.accessToken,
  )
  const user = useAppSelector((state) => state.user.user)
  const group = useAppSelector((state) => state.group.group)
  const livingBudget = useAppSelector((state) => state.livingBudget)
  const shouldInvite = useMemo(() => {
    return group ? group?.members?.length < group?.maxParticipants : false
  }, [group])

  const homeDescription = useMemo(() => {
    switch (status) {
      case ContractStatus.confirmed:
        return (
          <Description>
            함께한지<Title>333</Title>일째
          </Description>
        )
      case ContractStatus.pending:
      case ContractStatus.isContractApproved:
        return (
          <Description>
            계약서 승인이 진행 중입니다. {confirmedCount} /
            {group.maxParticipants}
          </Description>
        )
      default:
        return <Description>{t('main.description')}</Description>
    }
  }, [status, t, group])

  const contractMembers = useAppSelector(
    (state) => state.contract.contractMembers,
  )
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (!accessToken) {
      router.push('/auth/login')
      return
    }
  }, [accessToken, router, isMounted])

  const fetchAccount = useCallback(async () => {
    console.log('fetchAccount 호출됨')
    if (!user.id) return
    if (!livingBudget.livingAccountNo || !livingBudget.myAccountNo) {
      const response = await getLivingAccount()
      if (response.success) {
        console.log(
          'fetchAccount 당연히 값이 없어요 저장을 안 했으니까',
          response,
        )
        dispatch(setMyAccountNo(response.data.myAccountNo))
        dispatch(setLivingAccountNo(response.data.liveAccountNo))
      }
    }
  }, [
    user.id,
    livingBudget.livingAccountNo,
    livingBudget.myAccountNo,
    dispatch,
  ])

  useEffect(() => {
    fetchAccount()
  }, [user.id, fetchAccount])

  const confirmedCount = useMemo(() => {
    return contractMembers?.filter(
      (member) => member.status === ContractStatus.confirmed,
    ).length
  }, [contractMembers])

  const showMemberStatus = useMemo(() => {
    return (
      status !== ContractStatus.confirmed &&
      status !== ContractStatus.shouldInvite &&
      status !== ContractStatus.none
    )
  }, [status])

  const fetchContract = useCallback(async () => {
    console.log('fetchContract 호출됨')
    if (user.contractId) {
      const response = await getContract(user.contractId)
      if (response.success) {
        dispatch(setContract(response.data))
      }
    }
  }, [user.contractId, dispatch])

  useEffect(() => {
    fetchContract()
  }, [user.contractId, fetchContract])

  const fetchHomeOverView = useCallback(async () => {
    console.log('fetchHomeOverView 호출됨')
    const response = await getHomeOverview()
    if (response.success) {
      dispatch(setHomeOverview(response.data))
    }
  }, [dispatch])

  const fetchUnreadNotificationCount = useCallback(async () => {
    console.log('fetchUnreadNotificationCount 호출됨')
    const response = await getUnreadNotificationCount(user.id)
    if (response.success) {
      setHasUnreadNotification(response.data.count > 0)
    }
  }, [user.id])

  useEffect(() => {
    fetchUnreadNotificationCount()
    const interval = setInterval(
      () => {
        fetchUnreadNotificationCount()
      },
      30 * 60 * 1000,
    )
    return () => clearInterval(interval)
  }, [fetchUnreadNotificationCount])

  useEffect(() => {
    console.log('onboarding으로 가나 안 가나 확인해야 해요 ', user.groupId)
    if (!user.id) return
    if (!user.groupId) {
      router.push('/onboarding')
    }
  }, [user, router])

  const copyInviteCode = useCopyInviteCode(
    group.inviteCode,
    user.name,
    group.name,
  )

  const handleCopy = () => {
    copyInviteCode()
  }

  useEffect(() => {
    console.log(
      'status 설정을 해야 해요 ',
      user.id,
      user.contractId,
      contract.status,
    )
    if (!user.id) return
    if (shouldInvite) {
      setStatus(ContractStatus.shouldInvite)
    } else if (!user.contractId) {
      setStatus(ContractStatus.none)
    } else {
      setStatus(contract.status)
    }
    fetchHomeOverView()
  }, [user, fetchHomeOverView, shouldInvite, contract.status])

  const fetchGroup = useCallback(async () => {
    console.log('fetchGroup 호출됨')
    if (user.groupId == null || user.groupId === 0) return
    const response = await getGroup(user.groupId)
    if (response.success) {
      dispatch(setGroup(response.data))
    }
  }, [user.groupId, dispatch])

  useEffect(() => {
    fetchGroup()
  }, [user.groupId, fetchGroup])

  const fetchContractMembers = useCallback(async () => {
    if (!user.contractId) return
    const response = await getContractMembers(user.contractId)
    if (response.success) {
      dispatch(setContractMembers(response.data))
    }
  }, [user.contractId, dispatch])

  useEffect(() => {
    if (
      status !== ContractStatus.none &&
      status !== ContractStatus.shouldInvite
    ) {
      fetchContractMembers()
    }
  }, [status, fetchContractMembers])

  const cardItems: { key: ContractStatus; item: CardItem[] }[] = [
    {
      key: ContractStatus.shouldInvite,
      item: [
        {
          url: '/group/create/shareInviteCode',
          image: '/images/group/group-join.svg',
          title: t('main.codeCopy.title'),
          description: t('main.codeCopy.description'),
          children: (
            <TitleContainer>
              <p>{t('main.codeCopy.label')}</p>
              <p>{group.inviteCode}</p>
              <IconButton
                onClick={handleCopy}
                src="/icons/copy.svg"
                alt="copy"
              />
            </TitleContainer>
          ),
        },
      ],
    },
    {
      key: ContractStatus.none,
      item: [
        {
          url: '/contract/create',
          image: '/images/group/group-create.svg',
          title: t('contract.detail.none.button'),
          description: t('contract.detail.none.description', {
            value: homeOverview?.groupName,
          }),
        },
      ],
    },
    {
      key: ContractStatus.draft,
      item: [
        {
          url: '/contract/create',
          image: '/images/group/group-create.svg',
          title: t('contract.detail.draft.button'),
          description: t('contract.detail.draft.description'),
        },
      ],
    },
    {
      key: ContractStatus.isContractApproved,
      item: [
        {
          url: '/contract/detail',
          image: '/images/group/group-create.svg',
          title: t('contract.detail.is_contract_approved.button'),
          description: t('contract.detail.is_contract_approved.cardButton'),
        },
      ],
    },
    {
      key: ContractStatus.pending,
      item: [
        {
          url: '/contract/detail',
          image: '/images/group/group-create.svg',
          title: t('contract.detail.pending.button'),
          description: t('contract.detail.pending.description'),
        },
      ],
    },
    {
      key: ContractStatus.reviewRequired,
      item: [
        {
          url: '/contract/detail',
          image: '/images/group/group-create.svg',
          title: t('contract.detail.review_required.button'),
          description: t('contract.detail.review_required.description'),
        },
      ],
    },
    {
      key: ContractStatus.confirmed,
      item: [],
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
      <Main>
        <GroupName>{group.name}</GroupName>
        {homeDescription}
      </Main>

      <ImageContainer>
        <Image
          src="/images/home/home-main.png"
          alt="home-main"
          width={300}
          height={300}
          style={{ objectFit: 'cover' }}
        />
        <UserTileContainer>
          {group?.members &&
            group.members.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                variant="tile"
                size="large"
                contractStatus={
                  showMemberStatus
                    ? contractMembers?.find((member) => member.id === user.id)
                        ?.status
                    : ContractStatus.none
                }
              />
            ))}
        </UserTileContainer>
      </ImageContainer>

      <CardButton
        cardItems={
          cardItems.find((item) => item.key === status)?.item ?? []
        }></CardButton>
      <DashBoard />
      <LifeBudgetPreview />
    </HomeLayout>
  )
}
