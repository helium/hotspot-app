import { LocationGeocodedAddress } from 'expo-location'
import React, { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { getLocation } from '../../../store/user/appSlice'
import animateTransition from '../../../utils/animateTransition'
import { reverseGeocode } from '../../../utils/location'
import ReassertLocationFee from './ReassertLocationFee'
import ReassertLocationUpdate from './ReassertLocationUpdate'

type Coords = { latitude: number; longitude: number }
const ReassertLocation = () => {
  const [state, setState] = useState<'fee' | 'update' | 'confirm' | 'pending'>(
    'fee',
  )
  const [locationAddress, setLocationAddress] = useState<
    LocationGeocodedAddress | undefined
  >()
  const [, setUpdatedLocation] = useState<Coords | undefined>()
  const [, setUpdatedLocationConfirmation] = useState<Coords | undefined>()
  const dispatch = useAppDispatch()
  const {
    app: { currentLocation },
  } = useSelector((s: RootState) => s)

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

  switch (state) {
    case 'fee':
      return (
        <ReassertLocationFee
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
          key={state}
          confirming
          locationSelected={(latitude, longitude) => {
            setUpdatedLocationConfirmation({ latitude, longitude })
            animateTransition()
            setState('pending')
          }}
        />
      )
  }

  return null
}

export default memo(ReassertLocation)
