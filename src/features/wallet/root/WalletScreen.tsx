import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import { useAppDispatch } from '../../../store/store'
import {
  fetchAccountActivity,
  fetchPendingTransactions,
} from '../../../store/account/accountSlice'

const WalletScreen = () => {
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const updateData = () => {
    dispatch(fetchAccountActivity())
    dispatch(fetchPendingTransactions())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateData()
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box flex={1} backgroundColor="primaryBackground">
      <WalletView />
    </Box>
  )
}

export default WalletScreen
