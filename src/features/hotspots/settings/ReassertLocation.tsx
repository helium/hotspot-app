/* eslint-disable react/jsx-props-no-spreading */
import Balance, { CurrencyType } from '@helium/currency'
import { LocationGeocodedAddress } from 'expo-location'
import React, { useState, useEffect, memo } from 'react'
import { useAsync } from 'react-async-hook'
import { useSelector } from 'react-redux'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { getLocation } from '../../../store/user/appSlice'
import animateTransition from '../../../utils/animateTransition'
import { reverseGeocode } from '../../../utils/location'
import useAlert from '../../../utils/useAlert'
import ReassertLocationFee from './ReassertLocationFee'
import ReassertLocationUpdate from './ReassertLocationUpdate'
import * as Logger from '../../../utils/logger'

type Coords = { latitude: number; longitude: number }
const DEFAULT_FEE_DATA = {
  remainingFreeAsserts: 0,
  totalStakingAmountDC: new Balance(0, CurrencyType.dataCredit),
  totalStakingAmountUsd: new Balance(0, CurrencyType.usd),
  totalStakingAmount: new Balance(0, CurrencyType.networkToken),
  hasSufficientBalance: false,
  isFree: false,
}
type Props = { onFinished: () => void }
const ReassertLocation = ({ onFinished }: Props) => {
  const [state, setState] = useState<'fee' | 'update' | 'confirm' | 'success'>(
    'fee',
  )
  const [locationAddress, setLocationAddress] = useState<
    LocationGeocodedAddress | undefined
  >()
  const [updatedLocation, setUpdatedLocation] = useState<Coords | undefined>()
  const dispatch = useAppDispatch()
  const {
    app: { currentLocation },
  } = useSelector((s: RootState) => s)

  const { loadLocationFeeData } = useConnectedHotspotContext()

  const { result: feeData = DEFAULT_FEE_DATA } = useAsync(
    loadLocationFeeData,
    [],
  )

  const { showOKAlert } = useAlert()

  const amount = feeData.isFree
    ? 'O DC'
    : feeData.totalStakingAmountDC.toString()

  useEffect(() => {
    dispatch(getLocation())
  }, [dispatch])

  useEffect(() => {
    if (!currentLocation) return

    const getLoc = async () => {
      const locInfo = await reverseGeocode(
        currentLocation.latitude,
        currentLocation.longitude,
      )
      if (!locInfo.length) return

      setLocationAddress(locInfo[0])
    }
    getLoc()
  }, [currentLocation])

  useEffect(() => {
    if (!updatedLocation) return

    const getLoc = async () => {
      const locInfo = await reverseGeocode(
        updatedLocation.latitude,
        updatedLocation.longitude,
      )
      if (!locInfo.length) return

      setLocationAddress(locInfo[0])
    }
    getLoc()
  }, [updatedLocation])

  const handleFailure = async (error: unknown) => {
    Logger.error(error)
    await showOKAlert({
      titleKey: 'hotspot_settings.reassert.failTitle',
      messageKey: 'hotspot_settings.reassert.failSubtitle',
    })
    onFinished()
  }

  switch (state) {
    case 'fee':
      return (
        <ReassertLocationFee
          {...feeData}
          locationAddress={locationAddress}
          onChangeLocation={() => {
            animateTransition()
            setState('update')
          }}
        />
      )
    case 'update':
      return (
        <ReassertLocationUpdate
          key={state}
          amount={amount}
          locationSelected={(latitude, longitude) => {
            setUpdatedLocation({ latitude, longitude })
            animateTransition()
            setState('confirm')
          }}
        />
      )
    case 'confirm':
      return (
        <ReassertLocationUpdate
          amount={amount}
          key={state}
          confirming
          coords={updatedLocation}
          onFailure={handleFailure}
          onSuccess={() => {
            setState('success')
          }}
        />
      )
    case 'success':
      return (
        <ReassertLocationFee
          {...feeData}
          locationAddress={locationAddress}
          isPending
        />
      )
  }

  return null
}

export default memo(ReassertLocation)
