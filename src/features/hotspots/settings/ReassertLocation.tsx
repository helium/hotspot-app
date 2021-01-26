import { LocationGeocodedAddress } from 'expo-location'
import React, { useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { getLocation } from '../../../store/user/appSlice'
import { reverseGeocode } from '../../../utils/location'
import ReassertLocationFee from './ReassertLocationFee'

const ReassertLocation = () => {
  const [state] = useState<'fee' | 'update' | 'pending'>('fee')
  const [locationAddress, setLocationAddress] = useState<
    LocationGeocodedAddress | undefined
  >()
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
      return <ReassertLocationFee locationAddress={locationAddress} />
  }

  return null
}

export default memo(ReassertLocation)
