import AsyncStorage from '@react-native-async-storage/async-storage'
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

const reactotron = Reactotron.configure()
  .useReactNative()
  .use(reactotronRedux())

if (reactotron.setAsyncStorageHandler) {
  reactotron.setAsyncStorageHandler(AsyncStorage)
}

if (__DEV__) {
  reactotron.connect()
}
export default reactotron
