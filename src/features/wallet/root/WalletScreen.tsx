import React, { useEffect } from 'react'
import WalletView from './WalletView'
import Box from '../../../components/Box'
import { useAppDispatch } from '../../../store/store'
import { fetchAccountActivity } from '../../../store/account/accountSlice'

const WalletScreen = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchAccountActivity())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box flex={1} backgroundColor="primaryBackground">
      <WalletView />
    </Box>
  )
}

export default WalletScreen
