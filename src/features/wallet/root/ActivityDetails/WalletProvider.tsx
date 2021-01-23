import React, { createContext, ReactNode, useContext, useState } from 'react'
import { PendingTransaction, AnyTransaction } from '@helium/http'

const initialState = {
  activityItem: null,
  setActivityItem: () => {},
}

const useWallet = () => {
  const [activityItem, setActivityItem] = useState<
    PendingTransaction | AnyTransaction | null
  >(null)

  return { activityItem, setActivityItem }
}
const WalletContext = createContext<ReturnType<typeof useWallet>>(initialState)
const { Provider } = WalletContext

const WalletProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useWallet()}>{children}</Provider>
}

export const useWalletContext = () => useContext(WalletContext)

export default WalletProvider
