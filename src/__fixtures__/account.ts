import Balance, { CurrencyType } from '@helium/currency'
import { Account } from '@helium/http'

const account: Partial<Account> = {
  speculativeNonce: 30,
  secNonce: 0,
  secBalance: new Balance(0, CurrencyType.security),
  nonce: 30,
  dcNonce: 0,
  dcBalance: new Balance(0, CurrencyType.dataCredit),
  block: 883732,
  balance: new Balance(0, CurrencyType.networkToken),
  address: '13WWmUq4i8383Akd2ASDFifjklamncjvr5no8qimMrNMsSaM96e',
}

const createAccount = (opts: Partial<Account>): Partial<Account> => {
  return { ...account, ...opts }
}

export { account, createAccount }
