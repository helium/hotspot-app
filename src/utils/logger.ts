import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'

export const init = () => {
  if (__DEV__) return

  Sentry.init({
    dsn: Config.SENTRY_DSN,
  })
}

export const setUser = (userAddress: string) => {
  Sentry.setUser({ username: userAddress })
}

export const error = (e: unknown) => {
  Sentry.captureException(e)
}

export const breadcrumb = (message: string) => {
  Sentry.addBreadcrumb({
    message,
  })
}

export const prettyPrintToConsole = (whatever: any, prefix = '') => {
  console.log(`${prefix}\n${JSON.stringify(whatever, null, 2)}`)
}
