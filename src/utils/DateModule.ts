import { NativeModules } from 'react-native'

const { DateModule } = NativeModules
export default DateModule as {
  formatDate: (dateStr: string, dateFormat: string) => Promise<string>
}
