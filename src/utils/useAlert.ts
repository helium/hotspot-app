import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

const useAlert = () => {
  const { t } = useTranslation()

  const showOKAlert = (options: {
    titleKey: string
    messageKey?: string
    messageOptions?: Record<string, string>
    okKey?: string
  }): Promise<boolean> =>
    new Promise((resolve) => {
      const { titleKey, messageKey, messageOptions, okKey } = options
      const title = t(titleKey)
      const message = messageKey ? t(messageKey, messageOptions) : undefined
      Alert.alert(title, message, [
        {
          text: t(okKey || 'generic.ok'),
          onPress: () => resolve(true),
        },
      ])
    })

  const showOKCancelAlert = (options: {
    titleKey: string
    messageKey?: string
    messageOptions?: Record<string, string>
    okKey?: string
    cancelKey?: string
  }): Promise<boolean> =>
    new Promise((resolve) => {
      const { titleKey, messageKey, messageOptions, okKey, cancelKey } = options
      const title = t(titleKey)
      const message = messageKey ? t(messageKey, messageOptions) : undefined
      Alert.alert(title, message, [
        {
          text: t(cancelKey || 'generic.cancel'),
          style: 'destructive',
          onPress: () => resolve(false),
        },
        {
          text: t(okKey || 'generic.ok'),
          onPress: () => resolve(true),
        },
      ])
    })

  return { showOKCancelAlert, showOKAlert }
}

export default useAlert
