import { getCurrentPositionAsync } from 'expo-location'
import React, { useCallback, useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import ModalPicker from '../../../components/ModalPicker'
import hotspotsSlice, {
  HotspotSort,
} from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import usePermissionManager from '../../../utils/usePermissionManager'

const HotspotsPicker = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { requestLocationPermission } = usePermissionManager()

  const checkLocationPermissions = useCallback(async () => {
    const enabled = await requestLocationPermission()
    if (enabled) {
      const position = await getCurrentPositionAsync()
      return position.coords
    }
  }, [requestLocationPermission])

  const handleValueChanged = useCallback(
    async (order) => {
      if (order === HotspotSort.Near) {
        const currentLocation = await checkLocationPermissions()
        dispatch(hotspotsSlice.actions.changeOrder({ order, currentLocation }))
      } else {
        dispatch(hotspotsSlice.actions.changeOrder({ order }))
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
        marginHorizontal="xs"
        // can't assume other languages will have the same prefix
        // structure so we'll just leave it out for non-en
        prefix={i18n.language === 'en' ? 'Your' : undefined}
        data={data}
        onValueChanged={handleValueChanged}
      />
    </Box>
  )
}

export default memo(HotspotsPicker)
