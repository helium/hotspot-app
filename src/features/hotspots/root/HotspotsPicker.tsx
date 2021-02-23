import { getCurrentPositionAsync } from 'expo-location'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import ModalPicker from '../../../components/ModalPicker'
import hotspotsSlice, {
  HotspotSort,
} from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import usePermissionManager from '../../../utils/usePermissionManager'
import { RootState } from '../../../store/rootReducer'

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

  type PickerData = {
    label: string
    value: HotspotSort
  }
  const data: PickerData[] = useMemo(
    () => [
      {
        label: t(`hotspots.owned.filter.${HotspotSort.New}`),
        value: HotspotSort.New,
      },
      {
        label: t(`hotspots.owned.filter.${HotspotSort.Near}`),
        value: HotspotSort.Near,
      },
      {
        label: t(`hotspots.owned.filter.${HotspotSort.Earn}`),
        value: HotspotSort.Earn,
      },
      {
        label: t(`hotspots.owned.filter.${HotspotSort.Offline}`),
        value: HotspotSort.Offline,
      },
    ],
    [t],
  )

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      // marginVertical="m"
      width="100%"
      paddingHorizontal="l"
    >
      <ModalPicker
        // can't assume other languages will have the same prefix
        // structure so we'll just leave it out for non-en
        prefix={i18n.language === 'en' ? 'Your' : undefined}
        data={data}
        selectedValue={order}
        onValueChanged={handleValueChanged}
      />
    </Box>
  )
}

export default memo(HotspotsPicker)
