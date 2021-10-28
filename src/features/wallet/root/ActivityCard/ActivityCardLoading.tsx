import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import { DebouncedTouchableOpacityBox } from '../../../../components/TouchableOpacityBox'
import {
  fetchMoreTxns,
  fetchTxnsHead,
} from '../../../../store/activity/activitySlice'
import { RootState } from '../../../../store/rootReducer'
import { useAppDispatch } from '../../../../store/store'

const ActivityCardLoading = ({
  hasNoResults = false,
  showSkeleton,
}: {
  hasNoResults?: boolean
  showSkeleton: boolean
}) => {
  const { t } = useTranslation()
  const txns = useSelector((state: RootState) => state.activity.txns)
  const filter = useSelector((state: RootState) => state.activity.filter)
  const dispatch = useAppDispatch()

  const handleRetry = useCallback(() => {
    if (txns[filter].cursor && filter !== 'pending') {
      dispatch(fetchMoreTxns({ filter }))
    } else {
      dispatch(fetchTxnsHead({ filter }))
    }
  }, [dispatch, filter, txns])

  if (
    filter === 'all' &&
    txns[filter].status === 'fulfilled' &&
    !txns[filter].cursor
  ) {
    return (
      <Text
        padding="l"
        variant="body2"
        color="black"
        width="100%"
        textAlign="center"
      >
        {t('transactions.all_footer')}
      </Text>
    )
  }

  if (
    txns[filter].status === 'rejected' ||
    txns[filter].status === 'more_rejected'
  ) {
    return (
      <DebouncedTouchableOpacityBox onPress={handleRetry}>
        <Text
          padding="l"
          variant="body1"
          color="black"
          width="100%"
          textAlign="center"
        >
          {t('transactions.rejected')}
        </Text>
      </DebouncedTouchableOpacityBox>
    )
  }

  if (hasNoResults) {
    return (
      <Text
        padding="l"
        variant="body1"
        color="black"
        width="100%"
        textAlign="center"
      >
        {t('transactions.no_results')}
      </Text>
    )
  }

  if (
    txns[filter].status === 'pending' &&
    (!showSkeleton || txns[filter].data.length)
  ) {
    return (
      <Box padding="l">
        <ActivityIndicator color="gray" />
      </Box>
    )
  }

  return null
}

export default ActivityCardLoading
