import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import NewestHotspot from '@assets/images/newestHotspot.svg'
import NearestHotspot from '@assets/images/nearestHotspot.svg'
import OfflineHotspot from '@assets/images/offlineHotspot.svg'
import FollowedHotspot from '@assets/images/follow.svg'
import TopHotspot from '@assets/images/topHotspot.svg'
import { PermissionResponse } from 'expo-permissions'
import { useNavigation } from '@react-navigation/native'
import Box from '../../../components/Box'
import hotspotsSlice, {
  HotspotSort,
} from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import usePermissionManager from '../../../utils/usePermissionManager'
import { RootState } from '../../../store/rootReducer'
import usePrevious from '../../../utils/usePrevious'
import locationSlice, {
  getLocationPermission,
  getLocation,
} from '../../../store/location/locationSlice'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'

const HotspotsPicker = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { requestLocationPermission } = usePermissionManager()
  const order = useSelector((state: RootState) => state.hotspots.order)
  const navigation = useNavigation()
  const { currentLocation, permissionResponse, locationBlocked } = useSelector(
    (state: RootState) => state.location,
  )
  const followHotspotEnabled = useSelector(
    (state: RootState) => state.features.followHotspotEnabled,
  )
  const prevOrder = usePrevious(order)

  const maybeGetLocation = useCallback(
    async (okToPromptUser: boolean) => {
      // We don't know if we can request location
      let permResponse = permissionResponse
      if (!permResponse) {
        const { payload } = await dispatch(getLocationPermission())
        permResponse = payload as PermissionResponse
      }
      if (!permResponse) return // this shouldn't happen unless shit hits the fan

      if (permResponse.granted) {
        dispatch(getLocation())
      } else if (okToPromptUser && permResponse.canAskAgain) {
        const response = await requestLocationPermission()

        if (response) {
          dispatch(locationSlice.actions.updateLocationPermission(response))
        }

        if (response && response.granted) {
          dispatch(getLocation())
        } else {
          // Switch them to new hotspots, if we don't get location permission
          dispatch(hotspotsSlice.actions.changeFilter(HotspotSort.New))
        }
      }
    },
    [requestLocationPermission, dispatch, permissionResponse],
  )

  useEffect(() => {
    maybeGetLocation(false)
    return navigation.addListener('focus', () => {
      maybeGetLocation(false)
      dispatch(hotspotsSlice.actions.changeFilterData(currentLocation))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      currentLocation ||
      order !== HotspotSort.Near ||
      prevOrder === HotspotSort.Near
    )
      return

    // They've switched to Nearest filter and we don't have a location
    maybeGetLocation(true)
  }, [currentLocation, maybeGetLocation, order, prevOrder])

  useEffect(() => {
    dispatch(hotspotsSlice.actions.changeFilterData(currentLocation))
  }, [currentLocation, dispatch, order])

  const handleValueChanged = useCallback(
    async (newOrder) => {
      dispatch(hotspotsSlice.actions.changeFilter(newOrder))
    },
    [dispatch],
  )

  const data = useMemo(() => {
    const opts: HeliumSelectItemType[] = []
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.New}`),
      value: HotspotSort.New,
      Icon: NewestHotspot,
      color: 'purpleMain',
    })
    if (followHotspotEnabled) {
      opts.push({
        label: t(`hotspots.owned.filter.${HotspotSort.Followed}`),
        value: HotspotSort.Followed,
        Icon: FollowedHotspot,
        color: 'purpleBright',
      })
    }
    if (!locationBlocked) {
      opts.push({
        label: t(`hotspots.owned.filter.${HotspotSort.Near}`),
        value: HotspotSort.Near,
        Icon: NearestHotspot,
        color: 'purpleMain',
      })
    }
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.Earn}`),
      value: HotspotSort.Earn,
      Icon: TopHotspot,
      color: 'purpleMain',
    })
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.Offline}`),
      value: HotspotSort.Offline,
      Icon: OfflineHotspot,
      color: 'purpleMain',
    })
    return opts
  }, [followHotspotEnabled, locationBlocked, t])

  return (
    <Box flexDirection="row" alignItems="center" width="100%">
      <HeliumSelect
        paddingHorizontal="l"
        marginBottom="lm"
        data={data}
        selectedValue={order}
        onValueChanged={handleValueChanged}
        marginVertical="s"
      />
    </Box>
  )
}

export default memo(HotspotsPicker)
