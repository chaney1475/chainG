import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import styled from '@emotion/styled'

import {
  BottomSheet,
  ConfirmButton,
  CustomPicker,
  InputBox,
  UserItem,
} from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setShowRentRatio, updateRent } from '@/store/slices/contractSlice'
import { Label, ShowBox, Title } from '@/styles/styles'

import { Colon } from '../CustomPicker/style'
import { Switch } from '../Switch'
import { Description } from '../TitleHeader/styles'
import { Total } from './styles'

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const RentRatioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
`
const TileContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-around;
  width: 100%;
`
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: calc(60vh - 2rem);
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
const MoneyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  flex: 1;
  gap: 16px;
  & div:nth-of-type(2) {
    padding-top: 16px;
  }
`
export function RentRatio() {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const group = useAppSelector((state) => state.group.group)
  const showRentRatio = useAppSelector((state) => state.contract.showRentRatio)
  const rent = useAppSelector((state) => state.contract.contractRequest.rent)
  const { t } = useTranslation()

  const [totalUserAmount, setTotalUserAmount] = useState(
    rent.userPaymentInfo.reduce((sum, info) => sum + info.amount, 0),
  )

  useEffect(() => {
    if (showRentRatio) {
      if (rent.totalAmount && Object.keys(pickerValue).length > 0) {
        const totalRatio = Object.values(pickerValue).reduce(
          (sum, val) => sum + Number(val),
          0,
        )

        dispatch(
          updateRent({
            ...rent,
            totalRatio,
            userPaymentInfo: Object.entries(pickerValue).map(
              ([userId, ratio]) => ({
                id: Number(userId),
                userId: Number(userId),
                amount: Math.floor(
                  rent.totalAmount * (Number(ratio) / totalRatio),
                ),
                ratio: Number(ratio),
              }),
            ),
          }),
        )
      }
    } else {
      dispatch(
        updateRent({
          ...rent,
          userPaymentInfo: rent.userPaymentInfo.map((info) => {
            return {
              userId: info.userId,
              amount: info.amount,
              ratio: Math.round(Number(info.amount) / rent.totalAmount),
            }
          }),
        }),
      )
    }
  }, [rent.totalAmount, totalUserAmount, showRentRatio])

  useEffect(() => {
    setTotalUserAmount(
      rent.userPaymentInfo.reduce((sum, info) => sum + info.amount, 0),
    )
  }, [rent])
  const handleChange = (value: Record<string, string>, key: string) => {
    const newPickerValue = { ...pickerValue, [key]: value[key] }
    setPickerValue(newPickerValue)

    // 모든 값의 합산을 계산
    const totalRatio = Object.values(newPickerValue).reduce(
      (sum, val) => sum + Number(val),
      0,
    )

    // onChange를 통해 totalRatio 업데이트
    dispatch(
      updateRent({
        ...rent,
        totalRatio,
        userPaymentInfo: Object.entries(newPickerValue).map(
          ([userId, ratio]) => ({
            userId: Number(userId),
            amount: Math.floor(rent.totalAmount * (Number(ratio) / totalRatio)),
            ratio: Number(ratio),
          }),
        ),
      }),
    )
  }

  const [pickerValue, setPickerValue] = useState<Record<string, string>>(
    group.members.reduce(
      (acc, member) => {
        acc[member.id] = '1'
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  const selections = group.members.reduce(
    (acc, member) => {
      acc[member.id] = Array.from({ length: 100 }, (_, i) => (i + 1).toString())
      return acc
    },
    {} as Record<string, string[]>,
  )
  const formatMoney = (value: string) => {
    if (value) {
      const numericValue = value.replace(/[^0-9]/g, '')
      const formattedValue = new Intl.NumberFormat('ko-KR').format(
        Number(numericValue),
      )
      return `${formattedValue} 원`
    }
    return ''
  }
  return (
    <Container>
      <RentRatioContainer>
        <TitleContainer>
          <Title>{t('contract.rentTotalRatio.title')}</Title>
          <Switch
            checked={showRentRatio}
            onChange={(value) => dispatch(setShowRentRatio(value))}
            onText={t('contract.rentTotalRatio.switch.ratio')}
            offText={t('contract.rentTotalRatio.switch.money')}
          />
        </TitleContainer>
        {showRentRatio ? (
          <RentRatioContainer>
            <ShowBox onClick={() => setOpen(true)}>
              <TileContainer>
                {Object.entries(pickerValue).map(([key, value], index) => {
                  return (
                    <>
                      {index != 0 && (
                        <Colon key={index + 'colon'}>{t('picker.colon')}</Colon>
                      )}
                      <Label key={key}>{value}</Label>
                    </>
                  )
                })}
              </TileContainer>
            </ShowBox>
            <RentRatioContainer>
              {group.members.map((user) => (
                <TitleContainer key={user.id}>
                  <UserItem
                    key={user.id}
                    user={user}
                    variant="bar"
                  />
                  <Label id={user.id.toString()}>
                    {formatMoney(
                      rent?.userPaymentInfo
                        .find((info) => info.userId === user.id)
                        ?.amount?.toString() ?? '',
                    )}
                  </Label>
                </TitleContainer>
              ))}
              <Total>
                총합
                <Label>
                  {formatMoney(rent?.totalAmount?.toString() ?? '')}
                </Label>
              </Total>
            </RentRatioContainer>
            {totalUserAmount != rent.totalAmount && (
              <Description>{t('contract.rentTotalRatio.label')}</Description>
            )}
          </RentRatioContainer>
        ) : (
          <RentRatioContainer>
            {group.members.map((user) => (
              <MoneyContainer key={user.id}>
                <UserItem
                  key={user.id}
                  user={user}
                  variant="bar"
                />
                <InputBox
                  id={user.id.toString()}
                  type="money"
                  value={
                    rent?.userPaymentInfo
                      .find((info) => info.userId === user.id)
                      ?.amount?.toString() ?? ''
                  }
                  onChange={(e) =>
                    dispatch(
                      updateRent({
                        ...rent,
                        userPaymentInfo: rent.userPaymentInfo.map((info) =>
                          info.userId === user.id
                            ? { ...info, amount: Number(e.target.value) }
                            : info,
                        ),
                      }),
                    )
                  }
                />
              </MoneyContainer>
            ))}
            <Total>
              총합
              <Label>{formatMoney(totalUserAmount?.toString() ?? '')}</Label>
            </Total>
          </RentRatioContainer>
        )}
      </RentRatioContainer>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={{
          MIN: 0.3,
          MID: 0.6,
          MAX: 0.7,
        }}>
        <ModalContainer>
          <Title>{t('contract.rentTotalRatio.modalTitle')}</Title>
          <TileContainer>
            {group.members.map((user) => (
              <UserItem
                key={user.id}
                user={user}
              />
            ))}
          </TileContainer>
          <CustomPicker<Record<string, string>>
            handleChange={handleChange}
            pickerValue={pickerValue}
            selections={selections}
          />
          <ConfirmButton
            onClick={() => setOpen(false)}
            label="confirm"
          />
        </ModalContainer>
      </BottomSheet>
    </Container>
  )
}
