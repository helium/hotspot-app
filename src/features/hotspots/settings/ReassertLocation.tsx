/* eslint-disable react/jsx-props-no-spreading */
import Balance, { CurrencyType } from '@helium/currency'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { Hotspot } from '@helium/http'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import animateTransition from '../../../utils/animateTransition'
import ReassertLocationFee from './ReassertLocationFee'
import ReassertLocationUpdate from './ReassertLocationUpdate'
import { useHotspotSettingsContext } from './HotspotSettingsProvider'
import { decimalSeparator, groupSeparator } from '../../../utils/i18n'
import ReassertAddressSearch from './ReassertAddressSearch'
import { PlaceGeography } from '../../../utils/googlePlaces'

export type Coords = { latitude: number; longitude: number }
export type ReassertLocationState = 'fee' | 'update' | 'confirm' | 'search'
const DEFAULT_FEE_DATA = {
  remainingFreeAsserts: 0,
  totalStakingAmountDC: new Balance(0, CurrencyType.dataCredit),
  totalStakingAmountUsd: new Balance(0, CurrencyType.usd),
  totalStakingAmount: new Balance(0, CurrencyType.networkToken),
  hasSufficientBalance: false,
  isFree: false,
}
type Props = {
  hotspot: Hotspot
  onFinished: (
    updatedLocation: Coords | undefined,
    locationName: string,
  ) => void
  onStateChange: (state: ReassertLocationState) => void
}
const ReassertLocation = ({ hotspot, onFinished, onStateChange }: Props) => {
  const [state, setState] = useState<ReassertLocationState>('fee')
  const [updatedLocation, setUpdatedLocation] = useState<Coords | undefined>()
  const [locationName, setLocationName] = useState<string>()

  // TODO: Move & Fix
  const { loadLocationFeeData } = useConnectedHotspotContext()
  const { result: feeData = DEFAULT_FEE_DATA } = useAsync(
    loadLocationFeeData,
    [],
  )

  const handleBack = useCallback(() => {
    animateTransition()
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
    animateTransition()
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
            animateTransition()
            onStateChange('update')
            setState('update')
          }}
        />
      )
    case 'update':
      return (
        <ReassertLocationUpdate
          amount={amount}
          key={state}
          onCancel={handleBack}
          onSearch={handleSearch}
          onConfirm={handleComplete}
          locationSelected={(latitude, longitude, name) => {
            setUpdatedLocation({ latitude, longitude })
            setLocationName(name)
            animateTransition()
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
