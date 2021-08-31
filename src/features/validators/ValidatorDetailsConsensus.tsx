import { RewardsV2, Validator } from '@helium/http'
import React, { memo, useMemo, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import Box from '../../components/Box'
import { RootState } from '../../store/rootReducer'
import { fetchActivity } from '../../store/validators/validatorsSlice'
import { useBorderRadii, useSpacing } from '../../theme/themeHooks'
import animateTransition from '../../utils/animateTransition'
import SkeletonActivityItem from '../wallet/root/ActivityCard/SkeletonActivityItem'
import ValidatorDetailsConsensusItem, {
  ConsensusItem,
} from './ValidatorDetailsConsensusItem'

type Props = { validator?: Validator }
const ValidatorDetailsConsensus = ({ validator }: Props) => {
  const { lm } = useBorderRadii()
  const { m } = useSpacing()
  const [data, setData] = useState<ConsensusItem[]>([])
  const dispatch = useDispatch()
  const transactions = useSelector(
    (state: RootState) => state.validators.transactions,
  )

  useEffect(() => {
    if (!validator?.address) return

    dispatch(fetchActivity(validator.address))
  }, [dispatch, validator])

  const txns = useMemo(() => {
    if (!validator?.address) return []
    return transactions[validator.address]
  }, [transactions, validator?.address])

  useEffect(() => {
    let nextData: ConsensusItem[] = []
    if (txns) {
      nextData = txns.flatMap((txn) => {
        if (txn.type !== 'rewards_v2') return [] as ConsensusItem[]
        const rewards = txn as RewardsV2
        return rewards.rewards.flatMap((r) => {
          if (r.type !== 'consensus') return [] as ConsensusItem[]
          return [
            {
              ...r,
              block: rewards.startEpoch,
            } as ConsensusItem,
          ] as ConsensusItem[]
        })
      })
    }

    animateTransition('ValidatorDetailsConsensus.ChangeData', {
      enabledOnAndroid: false,
    })
    setData(nextData)
  }, [txns])

  type RewardItem = { index: number; item: ConsensusItem }
  const renderItem = useCallback(
    ({ index, item }: RewardItem) => {
      const isFirst = index === 0
      const isLast = index === data.length - 1
      return (
        <ValidatorDetailsConsensusItem
          isFirst={isFirst}
          isLast={isLast}
          item={item}
        />
      )
    },
    [data.length],
  )

  const keyExtractor = useCallback((item, index) => {
    const { block } = item as ConsensusItem
    return `${block}.${index}`
  }, [])

  const contentContainerStyle = useMemo(() => ({ paddingBottom: 32 }), [])
  const style = useMemo(() => ({ borderRadius: lm, marginTop: m, flex: 1 }), [
    lm,
    m,
  ])

  if (txns === undefined)
    return (
      <Box marginTop="m">
        <SkeletonActivityItem isFirst isLast />
      </Box>
    )

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={style}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
    />
  )
}

export default memo(ValidatorDetailsConsensus)
