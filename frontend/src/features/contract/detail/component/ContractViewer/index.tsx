'use client'

import { useTranslation } from 'react-i18next'

import { UserItem } from '@/components'
import { ShowBox, TitleContainer } from '@/styles/styles'
import { Contract, ContractRequest, RentUser } from '@/types/contract'
import { formatMoney } from '@/utils/format'

import { Container, DefaultLabel, HeaderTitle, UserContainer } from './styles'

export function ContractViewer({
  contract,
  rentUserList,
}: {
  contract: Contract | ContractRequest
  rentUserList: RentUser[]
}) {
  const startDate = new Date(contract.startDate)
  const endDate = new Date(contract.endDate)
  const contractDate = `${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()} - ${endDate.getFullYear()}.${endDate.getMonth() + 1}.${endDate.getDate()}`
  const userRentRatio = rentUserList.reduce(
    (acc, user, index) =>
      index === 0 ? String(user.ratio) : acc + ':' + String(user.ratio),
    '',
  )
  const { t } = useTranslation()
  return (
    <Container>
      <TitleContainer>
        <HeaderTitle>{t('contract.detail.contractDate')}</HeaderTitle>
        <DefaultLabel>{contractDate}</DefaultLabel>
      </TitleContainer>
      <TitleContainer>
        <HeaderTitle>{t('contract.detail.totalAmount')}</HeaderTitle>
        <DefaultLabel>{formatMoney(contract.rent.totalAmount)}</DefaultLabel>
      </TitleContainer>
      {contract.status}
      <div>{contract.endDate} </div>
      <div>{contract.startDate} </div>
      <hr />
      <div>{contract.rent.dueDate} </div>
      <div>{contract.rent.rentAccountNo} </div>
      <div>{contract.rent.ownerAccountNo} </div>
      <TitleContainer>
        <HeaderTitle>{t('contract.detail.totalAmount')}</HeaderTitle>
        <DefaultLabel>{contractDate}</DefaultLabel>
      </TitleContainer>
      <TitleContainer>
        <HeaderTitle>납부일</HeaderTitle>
        <DefaultLabel>매월 {contract.rent.dueDate}일</DefaultLabel>
      </TitleContainer>
      <TitleContainer>
        <HeaderTitle>분담비율</HeaderTitle>
        <DefaultLabel>{userRentRatio} </DefaultLabel>
      </TitleContainer>
      <div>
        <UserContainer>
          {rentUserList.map((user) => (
            <TitleContainer key={user.id}>
              <UserItem
                user={{ ...user }}
                variant="bar"
                size="small"
                showName={true}
              />
              <DefaultLabel>{formatMoney(user.amount)}</DefaultLabel>
            </TitleContainer>
          ))}
        </UserContainer>
      </div>
      <HeaderTitle>월세 계좌</HeaderTitle>
      <ShowBox>{t('fintech.cardName')}</ShowBox>
      <HeaderTitle>집주인 계좌</HeaderTitle>
      <ShowBox>{t('fintech.cardName')}</ShowBox>
      {contract.utility.cardId && (
        <>
          <HeaderTitle>분담비율</HeaderTitle>
          <ShowBox>{t('fintech.cardName')}</ShowBox>
        </>
      )}
    </Container>
  )
}
