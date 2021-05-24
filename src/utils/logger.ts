import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'

export const prettyPrintToConsole = (whatever: any, prefix = '') => {
  console.log(`${prefix}\n${JSON.stringify(whatever, null, 2)}`)
}

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
  if (__DEV__) {
    console.error(e)
  }
  Sentry.captureException(e)
}

export const breadcrumb = (message: string, data?: Sentry.Breadcrumb) => {
  const crumb = {
    message,
    data,
  }
  if (__DEV__ && Config.LOG_BREADCRUMBS === 'true') {
    if (data) {
      prettyPrintToConsole(crumb)
    } else {
      console.log(message)
    }
  }

  Sentry.addBreadcrumb(crumb)
}
