'use client'

import { useTranslation } from 'react-i18next'

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
  const paymentCurrent = useAppSelector((state) => state.pledge.paymentCurrent)
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.user.user)
  const rentTitle = paymentCurrent.rent
    ? `payment.paymentStatus.${paymentCurrent.rent}.title`
    : ''
  const rentLabel = paymentCurrent.rent
    ? `payment.paymentStatus.${paymentCurrent.rent}.label`
    : ''

  const utilityTitle = paymentCurrent.utility
    ? `payment.paymentStatus.${paymentCurrent.utility}.title`
    : ''
  const utilityLabel = paymentCurrent.utility
    ? `payment.paymentStatus.${paymentCurrent.utility}.label`
    : ''

  const userRentTitle = paymentCurrent.userRent
    ? `payment.userPaymentStatus.${paymentCurrent.userRent}.title`
    : ''
  const userRentLabel = paymentCurrent.userRent
    ? `payment.userPaymentStatus.${paymentCurrent.userRent}.label`
    : ''

  const userUtilityTitle = paymentCurrent.userUtility
    ? `payment.userPaymentStatus.${paymentCurrent.userUtility}.title`
    : ''
  const userUtilityLabel = paymentCurrent.userUtility
    ? `payment.userPaymentStatus.${paymentCurrent.userUtility}.label`
    : ''
  return (
    <Container>
      {paymentCurrent.rent && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="월세 미납 공지"
                width={21}
                height={21}
              />
              <p>
                [{t('main.issues.rent')}]{t(rentTitle)}
              </p>
            </NoticeTitle>
            <div>
              {t('payment.allPrefix')}
              {t(rentLabel)}
            </div>
          </div>
          <LinkContainer>
            <StyledLink href={'/pledge'}>확인하기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {paymentCurrent.utility && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="월세 미납 공지"
                width={21}
                height={21}
              />
              <p>
                [{t('main.issues.utility')}]{t(utilityTitle)}
              </p>
            </NoticeTitle>
            <div>
              {t('payment.allPrefix')}
              {t(utilityLabel)}
            </div>
          </div>
          <LinkContainer>
            <StyledLink href={'/pledge'}>확인하기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {paymentCurrent.userRent && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="월세 미납 공지"
                width={21}
                height={21}
              />
              <p>
                [{t('main.issues.rent')}]{t(userRentTitle)}
              </p>
            </NoticeTitle>
            <div>
              {t('payment.userPrefix', { value: user.name })}
              {t(userRentLabel)}
            </div>
          </div>
          <LinkContainer>
            <StyledLink href={'/pledge'}>확인하기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {paymentCurrent.userUtility && (
        <NoticeItem>
          <div>
            <NoticeTitle>
              <Image
                src={'/icons/notice-money.png'}
                alt="월세 미납 공지"
                width={21}
                height={21}
              />
              <p>
                [{t('main.issues.utility')}]{t(userUtilityTitle)}
              </p>
            </NoticeTitle>
            <div>
              {t('payment.userPrefix', { value: user.name })}
              {t(userUtilityLabel)}
            </div>
          </div>
          <LinkContainer>
            <StyledLink href={'/pledge'}>확인하기</StyledLink>
          </LinkContainer>
        </NoticeItem>
      )}
      {homeOverview.isLifeRuleApproved && (
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
