import { getCurrentPositionAsync } from 'expo-location'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import NewestHotspot from '@assets/images/newestHotspot.svg'
import NearestHotspot from '@assets/images/nearestHotspot.svg'
import OfflineHotspot from '@assets/images/offlineHotspot.svg'
import TopHotspot from '@assets/images/topHotspot.svg'
import Box from '../../../components/Box'
import hotspotsSlice, {
  HotspotSort,
} from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import usePermissionManager from '../../../utils/usePermissionManager'
import { RootState } from '../../../store/rootReducer'
import HeliumActionSheet from '../../../components/HeliumActionSheet'
import { HeliumActionSheetItemType } from '../../../components/HeliumActionSheetItem'

const HotspotsPicker = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { requestLocationPermission } = usePermissionManager()
  const {
    hotspots: { order },
  } = useSelector((state: RootState) => state)

  const checkLocationPermissions = useCallback(async () => {
    const enabled = await requestLocationPermission()
    if (enabled) {
      const position = await getCurrentPositionAsync()
      return position.coords
    }
  }, [requestLocationPermission])

  const handleValueChanged = useCallback(
    async (newOrder) => {
      if (newOrder === HotspotSort.Near) {
        const currentLocation = await checkLocationPermissions()
        dispatch(
          hotspotsSlice.actions.changeOrder({
            order: newOrder,
            currentLocation,
          }),
        )
      } else {
        dispatch(hotspotsSlice.actions.changeOrder({ order: newOrder }))
      }
    },
    [checkLocationPermissions, dispatch],
  )

  const data: HeliumActionSheetItemType[] = useMemo(
    () => [
      {
        label: t(`hotspots.owned.filter.${HotspotSort.New}`),
        value: HotspotSort.New,
        Icon: NewestHotspot,
      },
      {
        label: t(`hotspots.owned.filter.${HotspotSort.Near}`),
        value: HotspotSort.Near,
        Icon: NearestHotspot,
      },
      {
        label: t(`hotspots.owned.filter.${HotspotSort.Earn}`),
        value: HotspotSort.Earn,
        Icon: TopHotspot,
      },
      {
        label: t(`hotspots.owned.filter.${HotspotSort.Offline}`),
        value: HotspotSort.Offline,
        Icon: OfflineHotspot,
      },
    ],
    [t],
  )

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
