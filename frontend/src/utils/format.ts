export const formatMoney = (value: string | number): string => {
  const numericValue = String(value).replace(/[^0-9]/g, '')
  const formattedValue = new Intl.NumberFormat('ko-KR').format(
    Number(numericValue),
  )
  return `${formattedValue} 원`
}

export const parseMoney = (value: string): string => {
  return value.replace(/[^0-9]/g, '')
}
