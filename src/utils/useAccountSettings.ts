import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAsync } from 'react-async-hook'
import accountSlice, {
  fetchAccountSettings,
  transferAppSettingsToAccount,
} from '../store/account/accountSlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { fetchFeatures } from '../store/features/featuresSlice'
import { getAddress, getWalletApiToken } from './secureAccount'
import { updateClient } from './appDataClient'
import { getNetTypeString } from './accountUtils'

const settingsToTransfer = [
  'isFleetModeEnabled',
  'hasFleetModeAutoEnabled',
  'convertHntToCurrency',
]
// restores account settings and feature flags
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
  const fetchAccountSettingsFailed = useSelector(
    (state: RootState) => state.account.fetchAccountSettingsFailed,
  )
  const accountBackedUp = useSelector(
    (state: RootState) => state.app.isBackedUp,
  )
  const fetchFeaturesFailed = useSelector(
    (state: RootState) => state.features.fetchFeaturesFailed,
  )

  const refreshAccountSettingsAndFeatures = useCallback(async () => {
    dispatch(fetchFeatures())
    dispatch(fetchAccountSettings())
  }, [dispatch])

  // poll account settings and features every 30 seconds if they initially fail
  useEffect(() => {
    if (!fetchFeaturesFailed && !fetchAccountSettingsFailed) return
    const interval = setInterval(() => {
      if (fetchFeaturesFailed) {
        dispatch(fetchFeatures())
      }
      if (fetchAccountSettingsFailed) {
        dispatch(fetchAccountSettings())
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch, fetchAccountSettingsFailed, fetchFeaturesFailed])

  // enable proxy after wallet api token is loaded
  useAsync(async () => {
    const token = await getWalletApiToken()
    const address = await getAddress()
    updateClient({
      proxyEnabled: true,
      retryCount: 1,
      token,
      networkName: getNetTypeString(address?.netType),
    })
  }, [accountBackedUp])

  useAsync(async () => {
    if (!accountBackedUp) return

    await refreshAccountSettingsAndFeatures()
  }, [accountBackedUp, refreshAccountSettingsAndFeatures])

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
