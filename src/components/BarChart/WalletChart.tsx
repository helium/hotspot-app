/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { isEqual } from 'lodash'
import { useSelector } from 'react-redux'
import { add } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { BoxProps } from '@shopify/restyle'
import ChartContainer from './ChartContainer'
import CarotLeft from '../../assets/images/carot-left.svg'
import CarotRight from '../../assets/images/carot-right.svg'
import Box from '../Box'
import Text from '../Text'
import { ChartData, ChartRange, ChartRangeKeys } from './types'
import useHaptic from '../../utils/useHaptic'
import { useColors } from '../../theme/themeHooks'
import { useAppDispatch } from '../../store/store'
import { RootState } from '../../store/rootReducer'
import accountSlice, {
  fetchActivityChart,
} from '../../store/account/accountSlice'
import useCurrency from '../../utils/useCurrency'
import DateModule from '../../utils/DateModule'
import { Theme } from '../../theme/theme'
import HeliumSelect from '../HeliumSelect'
import { HeliumSelectItemType } from '../HeliumSelectItem'

type Props = BoxProps<Theme> & {
  height: number
  showSkeleton: boolean
}

const WalletChart = ({ height, showSkeleton, ...boxProps }: Props) => {
  const dispatch = useAppDispatch()
  const { triggerImpact } = useHaptic()
  const colors = useColors()
  const {
    account: { activityChart, activityChartRange },
    activity: { filter },
    heliumData: { blockHeight },
  } = useSelector((state: RootState) => state, selectorIsEqual)

  const { t } = useTranslation()

  const { hntToDisplayVal } = useCurrency()
  const [focusedData, setFocusedData] = useState<ChartData | null>(null)
  const [up, setUp] = useState('')
  const [down, setDown] = useState('')
  const [headerHeight, setHeaderHeight] = useState(65)

  useEffect(() => {
    const setValues = async () => {
      const u = await hntToDisplayVal(focusedData?.up || 0)
      const d = await hntToDisplayVal(focusedData?.down || 0)
      setUp(u)
      setDown(d)
    }
    setValues()
  }, [focusedData?.down, focusedData?.up, hntToDisplayVal])
  const [dataRange, setDataRange] = useState('')

  const data = useMemo(() => {
    const chartsByFilter = activityChart[filter]

    if (!chartsByFilter || !chartsByFilter[activityChartRange]) return null

    return chartsByFilter[activityChartRange]
  }, [filter, activityChart, activityChartRange])

  useEffect(() => {
    dispatch(
      fetchActivityChart({ range: activityChartRange, filterType: filter }),
    )
  }, [dispatch, filter, activityChartRange, blockHeight])

  const padding = 20
  const chartHeight = useMemo(() => height - headerHeight - padding, [
    headerHeight,
    height,
  ])

  const handleFocusData = useCallback(
    async (chartData: ChartData | null) => {
      setFocusedData(chartData)

      if (!chartData?.timestamp || activityChartRange !== 'monthly') return

      const startDate = new Date(chartData.timestamp)
      const endDate = add(startDate, { days: 29 })

      const start = await DateModule.formatDate(chartData.timestamp, 'MMM d')
      const end = await DateModule.formatDate(endDate.toISOString(), 'MMM d')
      setDataRange(`${start} - ${end}`)
    },
    [activityChartRange],
  )

  const showDataRange = useMemo(
    () =>
      (activityChartRange === 'monthly' && !!focusedData) ||
      filter === 'pending',
    [activityChartRange, focusedData, filter],
  )

  const chartRangeData = useMemo(
    () =>
      ChartRangeKeys.map((value) => ({
        label: t(`wallet.chartRanges.${value}.label`),
        value,
        Icon: undefined,
        color: 'purpleMain',
      })) as HeliumSelectItemType[],
    [t],
  )

  const handleChartRangeChanged = useCallback(
    (itemValue: string | number) => {
      dispatch(
        accountSlice.actions.setActivityChartRange(itemValue as ChartRange),
      )
      triggerImpact()
    },
    [dispatch, triggerImpact],
  )

  const handleHeaderLayout = useCallback(
    (e: LayoutChangeEvent) => setHeaderHeight(e.nativeEvent.layout.height),
    [],
  )

  const { greenBright, blueBright } = useColors()

  return (
    <Box {...boxProps} height={height}>
      <Box
        flexDirection="row"
        justifyContent="flex-end"
        alignItems="center"
        onLayout={handleHeaderLayout}
      >
        {focusedData && (
          <>
            <CarotLeft
              width={12}
              height={12}
              stroke={greenBright}
              strokeWidth={2}
            />
            <Text
              variant="body2"
              fontSize={16}
              maxFontSizeMultiplier={1.1}
              marginLeft="xxs"
              marginRight="xs"
              color="black"
            >
              {up}
            </Text>

            <CarotRight color={blueBright} width={12} height={12} />
            <Text
              variant="body1"
              maxFontSizeMultiplier={1.1}
              fontSize={16}
              marginLeft="xs"
              flex={1}
              color="grayDark"
            >
              {down}
            </Text>
          </>
        )}
        {!showDataRange && (
          <HeliumSelect
            width={undefined}
            scrollEnabled={false}
            flex={undefined}
            showGradient={false}
            data={chartRangeData}
            selectedValue={activityChartRange}
            onValueChanged={handleChartRangeChanged}
            marginBottom="l"
          />
        )}
        {showDataRange && (
          <Text
            maxWidth={150}
            variant="body2"
            adjustsFontSizeToFit
            numberOfLines={1}
            color="grayDark"
            fontSize={16}
            maxFontSizeMultiplier={1}
          >
            {dataRange}
          </Text>
        )}
      </Box>
      {filter !== 'pending' && (
        <ChartContainer
          loading={
            showSkeleton ||
            !data ||
            (data.loading === 'pending' && (data.data || []).length === 0)
          }
          height={chartHeight}
          data={data?.data}
          onFocus={handleFocusData}
          showXAxisLabel={activityChartRange !== 'monthly'}
          labelColor={colors.grayDark}
        />
      )}
    </Box>
  )
}

const selectorIsEqual = (prev: RootState, next: RootState) => {
  const activityChartEqual = isEqual(
    prev.account.activityChart,
    next.account.activityChart,
  )
  const rangeEqual =
    prev.account.activityChartRange === next.account.activityChartRange
  const filterEqual = prev.activity.filter === next.activity.filter
  const heightEqual =
    prev.heliumData.blockHeight === next.heliumData.blockHeight

  return activityChartEqual && rangeEqual && filterEqual && heightEqual
}

export default memo(WalletChart)
