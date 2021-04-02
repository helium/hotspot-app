import { AssertLocationV2, Transaction } from '@helium/transactions'
import { Balance, CurrencyType } from '@helium/currency'
import { calculateAssertLocFee } from './fees'
import { makeAssertLocTxn } from './transactions'
import { getAddress, getCurrentOraclePrice } from './appDataClient'
import { getStakingSignedTransaction, OnboardingRecord } from './stakingClient'
import { getH3Location } from './h3Utils'

export const assertLocationTxn = async (
  gateway: string | undefined,
  lat: number | undefined,
  lng: number | undefined,
  gain = 1.2,
  elevation = 0,
  nonce = 0,
  onboardingRecord: OnboardingRecord | undefined,
) => {
  const isFree = await hasFreeLocationAssert(nonce, onboardingRecord)
  const owner = await getAddress()
  const payer = isFree ? onboardingRecord?.maker.address : await getAddress()

  if (!owner || !payer || !gateway || !lat || !lng) {
    return undefined
  }

  const antennaGain = gain * 10
  const stakingFee = Transaction.stakingFeeTxnAssertLocationV1
  const location = getH3Location(lat, lng)

  const txn = await makeAssertLocTxn(
    owner,
    gateway,
    payer,
    location,
    nonce,
    antennaGain,
    elevation,
    stakingFee,
  )

  let finalTxn = txn

  if (isFree) {
    const stakingServerSignedTxn = await getStakingSignedTransaction(
      gateway,
      txn.toString(),
    )
    finalTxn = AssertLocationV2.fromString(stakingServerSignedTxn)
  }

  return finalTxn
}

export const loadLocationFeeData = async (
  nonce = 0,
  accountIntegerBalance = 0,
  onboardingRecord?: OnboardingRecord,
) => {
  const isFree = await hasFreeLocationAssert(nonce, onboardingRecord)
  const owner = await getAddress()
  const payer = isFree ? onboardingRecord?.maker.address : ''

  if (!owner || payer === undefined) {
    throw new Error('Missing payer or owner')
  }

  const { stakingFee, fee } = calculateAssertLocFee(owner, payer, nonce)

  const totalStakingAmountDC = new Balance(
    stakingFee + fee,
    CurrencyType.dataCredit,
  )
  const { price: oraclePrice } = await getCurrentOraclePrice()
  const totalStakingAmount = totalStakingAmountDC.toNetworkTokens(oraclePrice)
  const totalStakingAmountUsd = totalStakingAmountDC.toUsd(oraclePrice)

  const balance = accountIntegerBalance || 0
  const hasSufficientBalance = balance >= totalStakingAmount.integerBalance
  const remainingFreeAsserts =
    (onboardingRecord?.maker.locationNonceLimit || 0) - nonce

  return {
    isFree,
    hasSufficientBalance,
    remainingFreeAsserts,
    totalStakingAmount,
    totalStakingAmountDC,
    totalStakingAmountUsd,
  }
}

export const hasFreeLocationAssert = (
  nonce: number,
  onboardingRecord?: OnboardingRecord,
): boolean => {
  if (!onboardingRecord) {
    return false
  }
  const locationNonceLimit = onboardingRecord?.maker.locationNonceLimit || 0
  return nonce < locationNonceLimit
}
