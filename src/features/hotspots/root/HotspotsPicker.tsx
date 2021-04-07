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
import HeliumActionSheet from '../../../components/HeliumActionSheet'
import { HeliumActionSheetItemType } from '../../../components/HeliumActionSheetItem'
import usePrevious from '../../../utils/usePrevious'
import locationSlice, {
  getLocationPermission,
  getLocation,
} from '../../../store/location/locationSlice'

const HotspotsPicker = () => {
  const { t, i18n } = useTranslation()
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

  const data: HeliumActionSheetItemType[] = useMemo(() => {
    const opts = []
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.New}`),
      value: HotspotSort.New,
      Icon: NewestHotspot,
    })
    if (!locationBlocked) {
      opts.push({
        label: t(`hotspots.owned.filter.${HotspotSort.Near}`),
        value: HotspotSort.Near,
        Icon: NearestHotspot,
      })
    }
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.Earn}`),
      value: HotspotSort.Earn,
      Icon: TopHotspot,
    })
    if (followHotspotEnabled) {
      opts.push({
        label: t(`hotspots.owned.filter.${HotspotSort.Followed}`),
        value: HotspotSort.Followed,
        Icon: FollowedHotspot,
      })
    }
    opts.push({
      label: t(`hotspots.owned.filter.${HotspotSort.Offline}`),
      value: HotspotSort.Offline,
      Icon: OfflineHotspot,
    })
    return opts
  }, [followHotspotEnabled, locationBlocked, t])

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      width="100%"
      paddingHorizontal="l"
    >
      <HeliumActionSheet
        // can't assume other languages will have the same prefix
        // structure so we'll just leave it out for non-en
        prefix={i18n.language === 'en' ? 'Your' : undefined}
        data={data}
        title={t('hotspots.sort_by')}
        selectedValue={order}
        onValueChanged={handleValueChanged}
        marginVertical="s"
      />
    </Box>
  )
}

export default memo(HotspotsPicker)
