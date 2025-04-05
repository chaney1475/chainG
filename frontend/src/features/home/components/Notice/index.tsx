'use client'

import Image from 'next/image'

import { useAppSelector } from '@/hooks'
import { useIsLeader } from '@/hooks'

import {
  Container,
  LinkContainer,
  NoticeItem,
  NoticeTitle,
  StyledLink,
} from './styles'

export function Notice() {
  const homeOverview = useAppSelector((state) => state.user.homeOverview)
  const livingAccountNo = useAppSelector(
    (state) => state.livingBudget.livingAccountNo,
  )
  const isLeader = useIsLeader()

  return (
    <Container>
      {!homeOverview.isMyRentPaid && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="월세 미납 공지"
                width={21}
                height={21}
              />
              월세가 미납되었어요
            </NoticeTitle>
            <div>잔액을 확인해 주세요!</div>
          </div>
          <LinkContainer>
            <StyledLink href={'/budget/rent'}>채우러가기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {!homeOverview.isMyUtilityPaid && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="공과금 미납 공지"
                width={21}
                height={21}
              />
              공과금이 미납되었어요
            </NoticeTitle>
            <div>잔액을 확인해 주세요!</div>
          </div>
          <LinkContainer>
            <StyledLink href={'/budget/utility'}>채우러가기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {!homeOverview.isLifeRuleApproved && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/images/lifeRule/approve.svg'}
                alt="생활규정 미승인 공지"
                width={21}
                height={21}
              />
              승인 진행중인 생활 규칙이 있어요
            </NoticeTitle>
            <div>새로 바뀔 생활 규칙을 확인해 주세요!</div>
          </div>
          <LinkContainer>
            <StyledLink href={'/lifeRule/updateApprove'}>승인하기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {isLeader && !livingAccountNo && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="생활비"
                width={21}
                height={21}
              />
              생활비
            </NoticeTitle>
            <div>생활비 계좌를 개설해서 공금을 쉽게 관리해 보세요!</div>
          </div>
          <LinkContainer>
            <StyledLink href={'/budget/living/create'}>개설하기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
    </Container>
  )
}
