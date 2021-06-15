import 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Balance, { CurrencyType } from '@helium/currency'
import SendView from '../SendView'
import { render, cleanup, fireEvent } from '../../../../utils/testUtils'
import { createAccount } from '../../../../__fixtures__/account'

const { Screen, Navigator } = createStackNavigator()

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

it('renders correct German account balance', async () => {
  const { findByText } = render(
    <Navigator>
      <Screen name="SendView" component={SendView} />
    </Navigator>,
    {
      initialState: {
        account: {
          account: createAccount({
            balance: new Balance(79942876300, CurrencyType.networkToken),
          }),
        },
      },
    },
  )
  const text = await findByText('799,429 HNT Available')
  expect(text).toBeDefined()
})

it('formats German amount separator', async () => {
  const { findByTestId } = render(
    <Navigator>
      <Screen name="SendView" component={SendView} />
    </Navigator>,
    {
      initialState: {
        account: {
          account: createAccount({
            balance: new Balance(79942876300, CurrencyType.networkToken),
          }),
        },
      },
    },
  )
  const amountInput = await findByTestId('AmountInput')
  fireEvent.changeText(amountInput, '1000,35')
  expect(amountInput.props.value).toBe('1.000,35')
})
