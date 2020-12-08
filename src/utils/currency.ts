import round from 'lodash/round'
import BigNumber from 'bignumber.js'

export const TICKER = 'HNT'
export const SECURITY_TKN = 'ST'
export const DATA_CREDIT = 'DC'

BigNumber.config({
  EXPONENTIAL_AT: [-10, 20],
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
  },
})

export const abbrFormat = (num: number) => {
  let formatted
  if (num % 1 !== 0) formatted = `${round(num, 2)}`
  if (num > 999) formatted = `${round(num / 1000, 1)}k`
  if (num > 999999) formatted = `${round(num / 1000000, 1)}m`
  if (num > 999999999) formatted = `${round(num / 1000000000, 1)}b`
  return formatted
}

export const currencyFormat = (bones: number, maxDecimalPlaces?: number) => {
  const bigBones = new BigNumber(bones)
  const bigMultiplier = new BigNumber(0.00000001)
  const bigAtoms = bigBones.times(bigMultiplier)
  if (maxDecimalPlaces) return bigAtoms.toFormat(maxDecimalPlaces)
  return bigAtoms.toFormat()
}
