import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../components/SafeAreaBox'
import { RootState } from '../../store/rootReducer'
import { fetchStats } from '../../store/stats/statsSlice'
import { useAppDispatch } from '../../store/store'
import StatsView from './StatsView'

const StatsScreen = () => {
  const stats = useSelector((state: RootState) => state.stats)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchStats())
  }, [dispatch])

  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      justifyContent="space-evenly"
      alignContent="center"
      padding="xl"
      flexDirection="column"
    >
      <StatsView statsState={stats} />
    </SafeAreaBox>
  )
}

export default StatsScreen
