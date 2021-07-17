/* eslint-disable react/jsx-props-no-spreading */
import Balance, { CurrencyType } from '@helium/currency'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { Hotspot, Witness } from '@helium/http'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
import animateTransition from '../../../utils/animateTransition'
import ReassertLocationFee from './ReassertLocationFee'
import ReassertLocationUpdate from './ReassertLocationUpdate'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'
import ReassertAddressSearch from './ReassertAddressSearch'
import { PlaceGeography } from '../../../utils/googlePlaces'
import { loadLocationFeeData } from '../../../utils/assertLocationUtils'
import { OnboardingRecord } from '../../../utils/stakingClient'

export type Coords = { latitude: number; longitude: number }
export type ReassertLocationState = 'fee' | 'update' | 'confirm' | 'search'
export const DEFAULT_FEE_DATA = {
  remainingFreeAsserts: 0,
  totalStakingAmountDC: new Balance(0, CurrencyType.dataCredit),
  totalStakingAmountUsd: new Balance(0, CurrencyType.usd),
  totalStakingAmount: new Balance(0, CurrencyType.networkToken),
  hasSufficientBalance: false,
  isFree: false,
}
type Props = {
  hotspot: Hotspot | Witness
  onFinished: (
    updatedLocation: Coords | undefined,
    locationName: string,
  ) => void
  onStateChange: (state: ReassertLocationState) => void
  onboardingRecord?: OnboardingRecord
}
const ReassertLocation = ({
  hotspot,
  onFinished,
  onStateChange,
  onboardingRecord,
}: Props) => {
  const account = useSelector((state: RootState) => state.account.account)
  const [state, setState] = useState<ReassertLocationState>('fee')
  const [updatedLocation, setUpdatedLocation] = useState<Coords | undefined>()
  const [locationName, setLocationName] = useState<string>()

  const { result: feeData = DEFAULT_FEE_DATA } = useAsync(
    () =>
      loadLocationFeeData(
        hotspot.nonce,
        account?.balance?.integerBalance,
        onboardingRecord,
      ),
    [hotspot.nonce, account?.balance?.integerBalance, onboardingRecord],
  )

  const handleBack = useCallback(() => {
    animateTransition('ReassertLocation.HandleBack', {
      enabledOnAndroid: false,
    })
    switch (state) {
      case 'fee':
        onFinished(undefined, '')
        break
      case 'update':
        onStateChange('fee')
        setState('fee')
        break
      case 'search':
      case 'confirm':
        onStateChange('update')
        setState('update')
        break
    }
  }, [onFinished, onStateChange, state])

  const { enableBack } = useHotspotSettingsContext()
  useEffect(() => {
    enableBack(handleBack)
  }, [enableBack, handleBack])

  const handleComplete = () => {
    onFinished(updatedLocation, locationName || '')
  }

  const handleSearch = useCallback(() => {
    animateTransition('ReassertLocation.HandleSearch', {
      enabledOnAndroid: false,
    })
    onStateChange('search')
    setState('search')
  }, [onStateChange])

  const handleSearchSelectPlace = useCallback(
    (place: PlaceGeography, name: string) => {
      const { lat, lng } = place
      setUpdatedLocation({ latitude: lat, longitude: lng })
      setLocationName(name)
      onStateChange('confirm')
      setState('confirm')
    },
    [onStateChange],
  )

  const amount = feeData.isFree
    ? 'O DC'
    : feeData.totalStakingAmountDC.toString(0, {
        groupSeparator,
        decimalSeparator,
      })

  switch (state) {
    case 'fee':
      return (
        <ReassertLocationFee
          {...feeData}
          hotspot={hotspot}
          onChangeLocation={() => {
            animateTransition('ReassertLocation.OnChangeLocation', {
              enabledOnAndroid: false,
            })
            onStateChange('update')
            setState('update')
          }}
        />
      )
    case 'update':
      return (
        <ReassertLocationUpdate
          amount={amount}
          hotspot={hotspot}
          key={state}
          coords={
            hotspot.lat && hotspot.lng
              ? { latitude: hotspot.lat, longitude: hotspot.lng }
              : undefined
          }
          onCancel={handleBack}
          onSearch={handleSearch}
          onConfirm={handleComplete}
          locationSelected={(latitude, longitude, name) => {
            setUpdatedLocation({ latitude, longitude })
            setLocationName(name)
            animateTransition('ReassertLocation.LocationSelected', {
              enabledOnAndroid: false,
            })
            onStateChange('confirm')
            setState('confirm')
          }}
        />
      )
    case 'search':
      return <ReassertAddressSearch onSelectPlace={handleSearchSelectPlace} />
    case 'confirm':
      return (
        <ReassertLocationUpdate
          amount={amount}
          hotspot={hotspot}
          key={state}
          onCancel={handleBack}
          confirming
          coords={updatedLocation}
          onConfirm={handleComplete}
          onSearch={handleSearch}
        />
      )
  }
}

export default memo(ReassertLocation)
