import 'react-native'
import { cleanup } from '../../../../utils/testUtils'
import { findBalance, changeInputAmount } from './common'

afterEach(cleanup)

jest.mock('react-native-localize', () => ({
  getCountry: () => 'DE',
  getCurrencies: () => ['DM'],
  findBestAvailableLanguage: () => ({
    languageTag: 'de',
    isRTL: false,
  }),
  getLocales: () => [
    {
      countryCode: 'DE',
      languageTag: 'de',
      languageCode: 'de',
      isRTL: false,
    },
  ],
  getNumberFormatSettings: () => ({
    decimalSeparator: ',',
    groupingSeparator: '.',
  }),
  usesMetricSystem: () => true,
}))

describe('Test DE Payments', () => {
  it('renders correct account balance', async () => {
    const text = await findBalance(79942876300, '799,429 HNT Available')
    expect(text).toBeDefined()
  })

  it('comma formats amount separator', async () => {
    const displayText = await changeInputAmount(79942876300, '1000,35')
    expect(displayText).toBe('1.000,35')
  })
})
