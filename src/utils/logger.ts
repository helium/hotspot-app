/* eslint-disable no-console */
import Config from 'react-native-config'

export const prettyPrintToConsole = (whatever: unknown, prefix = '') => {
  console.log(`${prefix}\n${JSON.stringify(whatever, null, 2)}`)
}

export const error = (e: unknown) => {
  if (__DEV__) {
    console.error(e)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const breadcrumb = (message: string, data?: any) => {
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
}
