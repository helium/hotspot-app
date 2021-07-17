import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import NewestHotspot from '@assets/images/newestHotspot.svg'
import NearestHotspot from '@assets/images/nearestHotspot.svg'
import OfflineHotspot from '@assets/images/offlineHotspot.svg'
import FollowedHotspot from '@assets/images/follow.svg'
import TopHotspot from '@assets/images/topHotspot.svg'
import { useNavigation } from '@react-navigation/native'
import Box from '../../../components/Box'
import hotspotsSlice, {
  HotspotSort,
} from '../../../store/hotspots/hotspotsSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'
import usePrevious from '../../../utils/usePrevious'
import HeliumSelect from '../../../components/HeliumSelect'
import { HeliumSelectItemType } from '../../../components/HeliumSelectItem'
import useGetLocation from '../../../utils/useGetLocation'
import { useSpacing } from '../../../theme/themeHooks'

const HotspotsPicker = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const spacing = useSpacing()
  const maybeGetLocation = useGetLocation()
  const order = useSelector((state: RootState) => state.hotspots.order)
  const navigation = useNavigation()
  const { currentLocation, locationBlocked } = useSelector(
    (state: RootState) => state.location,
  )
  const followHotspotEnabled = useSelector(
    (state: RootState) => state.features.followHotspotEnabled,
  )
  const prevOrder = usePrevious(order)

  const locationDeniedHandler = useCallback(() => {
    dispatch(hotspotsSlice.actions.changeFilter(HotspotSort.New))
  }, [dispatch])

  useEffect(() => {
    maybeGetLocation(false, locationDeniedHandler)
    return navigation.addListener('focus', () => {
      maybeGetLocation(false, locationDeniedHandler)
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
    maybeGetLocation(true, locationDeniedHandler)
  }, [
    currentLocation,
    locationDeniedHandler,
    maybeGetLocation,
    order,
    prevOrder,
  ])

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

  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: spacing.l }),
    [spacing.l],
  )

  return (
    <Box flexDirection="row" alignItems="center" width="100%">
      <HeliumSelect
        contentContainerStyle={contentContainerStyle}
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
