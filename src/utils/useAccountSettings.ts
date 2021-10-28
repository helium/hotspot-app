import { useCallback, useEffect } from 'react'
import useAppState from 'react-native-appstate-hook'
import { useSelector } from 'react-redux'
import { useAsync } from 'react-async-hook'
import accountSlice, {
  fetchAccountSettings,
  transferAppSettingsToAccount,
} from '../store/account/accountSlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { updateClient } from './appDataClient'
import { updateNetwork } from './walletClient'
import { fetchFeatures } from '../store/features/featuresSlice'
import { getWalletApiToken } from './secureAccount'

const settingsToTransfer = [
  'isFleetModeEnabled',
  'hasFleetModeAutoEnabled',
  'convertHntToCurrency',
]
export default () => {
  const dispatch = useAppDispatch()
  const transferRequired = useSelector(
    (state: RootState) => state.account.settingsTransferRequired,
  )
  const accountSettingsLoaded = useSelector(
    (state: RootState) => state.account.settingsLoaded,
  )
  const accountSettings = useSelector(
    (state: RootState) => state.account.settings,
  )
  const accountBackedUp = useSelector(
    (state: RootState) => state.app.isBackedUp,
  )
  const retryCount = useSelector(
    (state: RootState) => state.features.appRetryCount,
  )
  const featuresLoaded = useSelector(
    (state: RootState) => state.features.featuresLoaded,
  )

  const refreshAccountSettingsAndFeatures = useCallback(async () => {
    await dispatch(fetchFeatures())
    await dispatch(fetchAccountSettings())
  }, [dispatch])

  useAsync(async () => {
    const token = await getWalletApiToken()
    updateClient({ network: accountSettings.network, retryCount, token })
  }, [accountBackedUp])

  useAsync(async () => {
    if (!accountSettings.network || !accountSettingsLoaded || !featuresLoaded)
      return

    const token = await getWalletApiToken()
    updateNetwork(accountSettings.network)
    updateClient({ network: accountSettings.network, retryCount, token })
  }, [
    accountSettings.network,
    accountSettingsLoaded,
    retryCount,
    featuresLoaded,
  ])

  useAsync(async () => {
    if (!accountBackedUp) return

    await refreshAccountSettingsAndFeatures()
  }, [accountBackedUp, refreshAccountSettingsAndFeatures])

  useAppState({
    onForeground: async () => refreshAccountSettingsAndFeatures(),
  })

  useEffect(() => {
    if (!accountSettingsLoaded || transferRequired !== undefined) return

    const allKeysFoundInApi = settingsToTransfer.every((s) =>
      Object.keys(accountSettings).includes(s),
    )

    dispatch(
      accountSlice.actions.updateSettingsTransferRequired(!allKeysFoundInApi),
    )
  }, [accountSettingsLoaded, accountSettings, transferRequired, dispatch])

  useEffect(() => {
    if (!transferRequired) return

    dispatch(transferAppSettingsToAccount())
  }, [dispatch, transferRequired])
}
