import { LOCATION, getAsync, askAsync, PermissionType } from 'expo-permissions'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../store/store'
import userSlice from '../store/user/userSlice'
import useAlert from './useAlert'

const usePermissionManager = () => {
  const { t } = useTranslation()
  const { showOKCancelAlert } = useAlert()
  const dispatch = useAppDispatch()

  const requestPermission = async (type: PermissionType) => {
    dispatch(userSlice.actions.requestingPermission(true))
    const { status } = await askAsync(type)
    dispatch(userSlice.actions.requestingPermission(false))
    return status === 'granted'
  }

  const requestLocationPermission = async () => {
    const perms = await getAsync(LOCATION)
    if (perms.status === 'granted') return true

    showOKCancelAlert(
      async (decision) => {
        if (!decision) return false

        return requestPermission(LOCATION)
      },
      t('permissions.location.title'),
      t('permissions.location.message'),
    )
  }

  return { requestLocationPermission }
}
export default usePermissionManager
