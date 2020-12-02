import { LOCATION, getAsync, askAsync, PermissionType } from 'expo-permissions'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

const usePermissionManager = () => {
  const { t } = useTranslation()

  const requestPermission = async (type: PermissionType) => {
    // TODO: set is redux isAskingForPermission to true
    const { status } = await askAsync(type)
    // TODO: set is redux isAskingForPermission to false
    return status === 'granted'
  }

  const showOKCancelAlert = (
    callback: (decision: boolean) => void,
    titleKey: string,
    messageKey?: string,
  ) => {
    const title = t(titleKey)
    const message = messageKey ? t(messageKey) : undefined
    Alert.alert(title, message, [
      {
        text: t('generic.cancel'),
        style: 'cancel',
        onPress: () => callback(false),
      },
      {
        text: t('generic.ok'),
        style: 'destructive',
        onPress: () => callback(true),
      },
    ])
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
