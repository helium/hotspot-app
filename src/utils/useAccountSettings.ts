import { useCallback, useEffect } from 'react'
import useAppState from 'react-native-appstate-hook'
import { useSelector } from 'react-redux'
import accountSlice, {
  fetchAccountSettings,
  transferAppSettingsToAccount,
} from '../store/account/accountSlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { updateClient } from './appDataClient'
import { updateNetwork } from './walletClient'

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

  const refreshAccountSettings = useCallback(
    () => dispatch(fetchAccountSettings()),
    [dispatch],
  )

  useEffect(() => {
    if (!accountSettings.network || !accountSettingsLoaded) return

    updateNetwork(accountSettings.network)
    updateClient(accountSettings.network, retryCount)
  }, [accountSettings.network, accountSettingsLoaded, retryCount])

  useEffect(() => {
    if (!accountBackedUp) return

    refreshAccountSettings()
  }, [accountBackedUp, refreshAccountSettings])

  useAppState({
    onForeground: () => refreshAccountSettings(),
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
