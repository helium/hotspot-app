import { LOCATION, getAsync, askAsync, PermissionType } from 'expo-permissions'
import { useAppDispatch } from '../store/store'
import appSlice from '../store/user/appSlice'
import useAlert from './useAlert'

const usePermissionManager = () => {
  const { showOKCancelAlert } = useAlert()
  const dispatch = useAppDispatch()

  const requestPermission = async (type: PermissionType) => {
    dispatch(appSlice.actions.requestingPermission(true))
    const { status } = await askAsync(type)
    dispatch(appSlice.actions.requestingPermission(false))
    return status === 'granted'
  }

  const hasLocationPermission = async () => {
    const perms = await getAsync(LOCATION)
    return perms.status === 'granted'
  }

  const requestLocationPermission = async () => {
    const hasPermission = await hasLocationPermission()
    if (hasPermission) return true

    const decision = await showOKCancelAlert({
      titleKey: 'permissions.location.title',
      messageKey: 'permissions.location.message',
    })
    if (!decision) return false

    return requestPermission(LOCATION)
  }

  return { requestLocationPermission, hasLocationPermission }
}
export default usePermissionManager
