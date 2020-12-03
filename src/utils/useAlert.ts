import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

const useAlert = () => {
  const { t } = useTranslation()

  const showOKCancelAlert = (
    callback: (decision: boolean) => void,
    titleKey: string,
    messageKey?: string,
    okKey?: string,
    cancelKey?: string,
  ) => {
    const title = t(titleKey)
    const message = messageKey ? t(messageKey) : undefined
    Alert.alert(title, message, [
      {
        text: t(cancelKey || 'generic.cancel'),
        style: 'destructive',
        onPress: () => callback(false),
      },
      {
        text: t(okKey || 'generic.ok'),
        onPress: () => callback(true),
      },
    ])
  }
  return { showOKCancelAlert }
}

export default useAlert
