import 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Balance, { CurrencyType } from '@helium/currency'
import SendView from '../SendView'
import { render, cleanup, fireEvent } from '../../../../utils/testUtils'
import { createAccount } from '../../../../__fixtures__/account'

const { Screen, Navigator } = createStackNavigator()

afterEach(cleanup)

export const rendered = (amount: number) =>
  render(
    <Navigator>
      <Screen name="SendView" component={SendView} />
    </Navigator>,
    {
      initialState: {
        account: {
          account: createAccount({
            balance: new Balance(amount, CurrencyType.networkToken),
          }),
        },
      },
    },
  )

export const findBalance = async (
  accountBalance: number,
  expectedText: string,
) => {
  const { findByText } = rendered(accountBalance)
  return findByText(expectedText)
}

export const changeInputAmount = async (
  accountBalance: number,
  textToInput: string,
) => {
  const { findByTestId } = rendered(accountBalance)
  const amountInput = await findByTestId('AmountInput')
  fireEvent.changeText(amountInput, textToInput)
  return amountInput.props.value
}
