import { useRouter } from 'next/navigation'

import { IconButton } from '@/components'
import { useAppSelector } from '@/hooks'
import {
  DefaultContainer,
  SlimContainer,
  Title,
  TitleContainer,
} from '@/styles/styles'
import { formatMoney } from '@/utils/format'

import { CardDescription } from './styles'

export function LifeBudgetPreview() {
  const router = useRouter()

  const livingAccountPaymentHistory = useAppSelector(
    (state) => state.livingBudget.livingAccountPaymentHistory,
  )
  return (
    <DefaultContainer onClick={() => router.push('/budget/living')}>
      <SlimContainer>
        <TitleContainer>
          <Title>생활비</Title>
          <IconButton
            src={'/icons/arrow-right.svg'}
            alt="생활비"
            onClick={() => router.push('/budget/living')}
          />
        </TitleContainer>
      </SlimContainer>
      {livingAccountPaymentHistory.length > 2 && (
        <DefaultContainer>
          <SlimContainer>
            <TitleContainer>
              <CardDescription>
                {livingAccountPaymentHistory[0].transactionSummary}
              </CardDescription>
              <CardDescription>
                {formatMoney(livingAccountPaymentHistory[0].transactionBalance)}
              </CardDescription>
            </TitleContainer>
          </SlimContainer>
          <SlimContainer>
            <TitleContainer>
              <CardDescription>
                {livingAccountPaymentHistory[1].transactionSummary}
              </CardDescription>
              <CardDescription>
                {formatMoney(livingAccountPaymentHistory[1].transactionBalance)}
              </CardDescription>
            </TitleContainer>
          </SlimContainer>
        </DefaultContainer>
      )}
    </DefaultContainer>
  )
}
