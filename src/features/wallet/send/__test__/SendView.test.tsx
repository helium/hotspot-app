import 'react-native'
import { cleanup, fireEvent } from '../../../../utils/testUtils'
import { findBalance, changeInputAmount, rendered } from './common'

afterEach(cleanup)

describe('Test EN Payments', () => {
  it('renders correct account balance', async () => {
    const text = await findBalance(79942876300, '799.429 HNT Available')
    expect(text).toBeDefined()
  })

  it('comma formats amount separator', async () => {
    const displayText = await changeInputAmount(79942876300, '1000.35')
    expect(displayText).toBe('1,000.35')
  })

  it('displays error when payment greater than balance', async () => {
    const { findByText, findByTestId } = rendered(79942876300)
    const amountInput = await findByTestId('AmountInput')
    fireEvent.changeText(amountInput, '1000')
    const el = await findByText('You do not have enough HNT in your account.')
    expect(el).toBeDefined()
  })
})
