import { LOCATION, askAsync, PermissionType } from 'expo-permissions'
import { useAppDispatch } from '../store/store'
import appSlice from '../store/user/appSlice'
import useAlert from './useAlert'

const usePermissionManager = () => {
  const { showOKCancelAlert } = useAlert()
  const dispatch = useAppDispatch()

  const requestPermission = async (type: PermissionType) => {
    dispatch(appSlice.actions.requestingPermission(true))
    const response = await askAsync(type)
    dispatch(appSlice.actions.requestingPermission(false))
    return response
  }

  const requestLocationPermission = async (showAlert = true) => {
    if (showAlert) {
      const decision = await showOKCancelAlert({
        titleKey: 'permissions.location.title',
        messageKey: 'permissions.location.message',
      })
      if (!decision) return false
    }

    return requestPermission(LOCATION)
  }

  return { requestLocationPermission, requestPermission }
}
export default usePermissionManager
