'use client'

import { useTranslation } from 'react-i18next'

import { Image } from '@/components'
import { useAppSelector } from '@/hooks'
import { useIsLeader } from '@/hooks'

import {
  Container,
  LinkContainer,
  NoticeContent,
  NoticeDescription,
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
          <Image
            src="/images/notification/notification-rent.svg"
            alt="rent"
            width={21}
            height={21}
          />
          <NoticeContent>
            <NoticeTitle>
              [{t('main.issues.rent')}]{t(rentTitle)}
            </NoticeTitle>
            <NoticeDescription>
              <span>
                {t('payment.allPrefix')}
                {t(rentLabel)}
              </span>
              <LinkContainer>
                <StyledLink href={'/pledge'}>확인하기</StyledLink>
              </LinkContainer>
            </NoticeDescription>
          </NoticeContent>
        </NoticeItem>
      )}
      {paymentCurrent.userRent && (
        <NoticeItem>
          <Image
            src="/images/notification/notification-rent.svg"
            alt="userRent"
            width={21}
            height={21}
          />
          <NoticeContent>
            <NoticeTitle>
              [{t('main.issues.rent')}]{t(userRentTitle)}
            </NoticeTitle>
            <NoticeDescription>
              <span>
                {t('payment.userPrefix', { value: user.name })}
                {t(userRentLabel)}
              </span>
              <LinkContainer>
                <StyledLink href={'/pledge'}>확인하기</StyledLink>
              </LinkContainer>
            </NoticeDescription>
          </NoticeContent>
        </NoticeItem>
      )}
      {paymentCurrent.utility && (
        <NoticeItem>
          <Image
            src="/images/notification/notification-utility.svg"
            alt="utility"
            width={21}
            height={21}
          />
          <NoticeContent>
            <NoticeTitle>
              [{t('main.issues.utility')}]{t(utilityTitle)}
            </NoticeTitle>
            <NoticeDescription>
              <span>
                {t('payment.allPrefix')}
                {t(utilityLabel)}
              </span>{' '}
              <LinkContainer>
                <StyledLink href={'/pledge'}>확인하기</StyledLink>
              </LinkContainer>
            </NoticeDescription>
          </NoticeContent>
        </NoticeItem>
      )}

      {paymentCurrent.userUtility && (
        <NoticeItem>
          <Image
            src="/images/notification/notification-utility.svg"
            alt="userUtility"
            width={21}
            height={21}
          />
          <NoticeContent>
            <NoticeTitle>
              [{t('main.issues.utility')}]{t(userUtilityTitle)}
            </NoticeTitle>
            <NoticeDescription>
              <span>
                {t('payment.userPrefix', { value: user.name })}
                {t(userUtilityLabel)}
              </span>
              <LinkContainer>
                <StyledLink href={'/pledge'}>확인하기</StyledLink>
              </LinkContainer>
            </NoticeDescription>
          </NoticeContent>
        </NoticeItem>
      )}
      {homeOverview.isLifeRuleApproved && (
        <NoticeItem>
          <Image
            src="/images/notification/notification-rule.svg"
            alt="생활 규칙 미승인 공지"
            width={21}
            height={21}
          />
          <NoticeContent>
            <NoticeTitle>
              [생활 규칙] 승인 진행중인 생활 규칙이 있어요
            </NoticeTitle>
            <NoticeDescription>
              <span>새로 바뀔 생활 규칙을 확인해 주세요!</span>
              <LinkContainer>
                <StyledLink href={'/lifeRule/updateApprove'}>
                  승인하기
                </StyledLink>
              </LinkContainer>
            </NoticeDescription>
          </NoticeContent>
        </NoticeItem>
      )}
      {isLeader && !livingAccountNo && (
        <NoticeItem>
          <Image
            src="/images/notification/notification-livingBudget.svg"
            alt="생활비"
            width={21}
            height={21}
          />
          <NoticeContent>
            <NoticeTitle>생활비</NoticeTitle>
            <NoticeDescription>
              <span>생활비 계좌를 개설해서 공금을 쉽게 관리해 보세요!</span>
              <LinkContainer>
                <StyledLink href={'/budget/living/create'}>개설하기</StyledLink>
              </LinkContainer>
            </NoticeDescription>
          </NoticeContent>
        </NoticeItem>
      )}
    </Container>
  )
}
