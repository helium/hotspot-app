import { AssertLocationV2, Transaction } from '@helium/transactions'
import { Balance, CurrencyType } from '@helium/currency'
import { calculateAssertLocFee } from './fees'
import { makeAssertLocTxn } from './transactions'
import {
  getAddress,
  getChainVars,
  getCurrentOraclePrice,
  getHotspotDetails,
} from './appDataClient'
import { getStakingSignedTransaction, OnboardingRecord } from './stakingClient'
import { getH3Location } from './h3Utils'
import * as Logger from './logger'

export const assertLocationTxn = async ({
  gateway,
  lat,
  lng,
  decimalGain = 1.2,
  elevation = 0,
  onboardingRecord,
  updatingLocation,
  dataOnly,
}: {
  gateway: string | undefined
  lat: number | undefined
  lng: number | undefined
  decimalGain?: number
  elevation?: number
  onboardingRecord: OnboardingRecord | undefined
  updatingLocation: boolean
  dataOnly: boolean
}) => {
  if (!gateway) {
    return undefined
  }

  let speculativeNonce = 0
  try {
    const response = await getHotspotDetails(gateway)
    speculativeNonce = response.speculativeNonce || 0
  } catch (e) {
    Logger.breadcrumb(`Could not find hotspot details for ${gateway}`)
  }
  const newNonce = speculativeNonce + 1
  let isFree = false
  if (!dataOnly) {
    isFree = hasFreeLocationAssert(speculativeNonce, onboardingRecord)
  }
  const owner = await getAddress()
  const payer = isFree ? onboardingRecord?.maker?.address : owner

  if (!owner || !payer || !lat || !lng) {
    return undefined
  }

  const antennaGain = decimalGain * 10
  let stakingFee = 0
  if (updatingLocation) {
    if (dataOnly) {
      const chainVars = await getChainVars([
        'staking_fee_txn_assert_location_dataonly_gateway_v1',
      ])
      const { stakingFeeTxnAssertLocationDataonlyGatewayV1: fee } = chainVars
      stakingFee = fee
    } else {
      stakingFee = Transaction.stakingFeeTxnAssertLocationV1
    }
  }
  const location = getH3Location(lat, lng)

  const txn = await makeAssertLocTxn(
    owner,
    gateway,
    payer,
    location,
    newNonce,
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

export const loadLocationFeeData = async ({
  nonce = 0,
  accountIntegerBalance = 0,
  onboardingRecord,
  dataOnly = false,
}: {
  nonce?: number
  accountIntegerBalance?: number
  onboardingRecord?: OnboardingRecord
  dataOnly?: boolean
}) => {
  let isFree = false
  if (!dataOnly) {
    isFree = hasFreeLocationAssert(nonce, onboardingRecord)
  }
  const owner = await getAddress()
  const payer = isFree ? onboardingRecord?.maker?.address : owner

  if (!owner || !payer) {
    throw new Error('Missing payer or owner')
  }

  const { price: oraclePrice } = await getCurrentOraclePrice()

  let totalStakingAmountDC = new Balance(0, CurrencyType.dataCredit)

  if (!dataOnly) {
    const { stakingFee, fee } = calculateAssertLocFee(owner, payer, nonce)

    totalStakingAmountDC = new Balance(
      stakingFee + fee,
      CurrencyType.dataCredit,
    )
  } else {
    const chainVars = await getChainVars([
      'staking_fee_txn_assert_location_dataonly_gateway_v1',
    ])
    const { stakingFeeTxnAssertLocationDataonlyGatewayV1: fee } = chainVars
    totalStakingAmountDC = new Balance(fee, CurrencyType.dataCredit)
  }

  const totalStakingAmount = totalStakingAmountDC.toNetworkTokens(oraclePrice)
  const totalStakingAmountUsd = totalStakingAmountDC.toUsd(oraclePrice)

  const balance = accountIntegerBalance || 0
  const hasSufficientBalance = balance >= totalStakingAmount.integerBalance
  const remainingFreeAsserts =
    (onboardingRecord?.maker?.locationNonceLimit || 0) - nonce

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
  if (!onboardingRecord || !onboardingRecord.maker) {
    return false
  }
  const locationNonceLimit = onboardingRecord?.maker.locationNonceLimit || 0
  return nonce < locationNonceLimit
}
