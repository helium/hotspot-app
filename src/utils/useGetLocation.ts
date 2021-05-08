import { PermissionResponse } from 'expo-permissions'
import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import locationSlice, {
  getLocation,
  getLocationPermission,
} from '../store/location/locationSlice'
import { RootState } from '../store/rootReducer'
import { useAppDispatch } from '../store/store'
import { LocationCoords } from './location'
import usePermissionManager from './usePermissionManager'
import usePrevious from './usePrevious'

const useGetLocation = () => {
  const dispatch = useAppDispatch()
  const { requestLocationPermission } = usePermissionManager()
  const { permissionResponse } = useSelector(
    (state: RootState) => state.location,
  )
  const {
    app: { appStateStatus },
  } = useSelector((state: RootState) => state)
  const prevAppStateStatus = usePrevious(appStateStatus)

  useEffect(() => {
    if (appStateStatus === 'active' && prevAppStateStatus === 'background') {
      // They might have gone to phone settings and changed the location permission
      dispatch(getLocationPermission())
    }
  }, [appStateStatus, dispatch, prevAppStateStatus])

  const dispatchGetLocation = useCallback(async () => {
    const { payload } = await dispatch(getLocation())
    return payload as LocationCoords | null
  }, [dispatch])

  const maybeGetLocation = useCallback(
    async (canPromptUser: boolean | 'skip', deniedHandler?: () => void) => {
      // We don't know if we can request location
      let permResponse = permissionResponse
      if (!permResponse) {
        const { payload } = await dispatch(getLocationPermission())
        permResponse = payload as PermissionResponse
      }
      if (!permResponse) return null // this shouldn't happen unless shit hits the fan

      if (permResponse.granted) {
        return dispatchGetLocation()
      }
      if (canPromptUser !== false && permResponse.canAskAgain) {
        const response = await requestLocationPermission(
          canPromptUser !== 'skip',
        )

        if (response) {
          dispatch(locationSlice.actions.updateLocationPermission(response))
        }

        if (response && response.granted) {
          return dispatchGetLocation()
        }
        deniedHandler?.()
        return null
      }
      return null
    },
    [
      permissionResponse,
      dispatch,
      dispatchGetLocation,
      requestLocationPermission,
    ],
  )
  return maybeGetLocation
}

export default useGetLocation
