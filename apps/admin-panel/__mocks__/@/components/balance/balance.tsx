import React from 'react'
import { jest } from '@jest/globals'

const Balance = jest.fn(({ amount, currency, ...props }) => (
  <div data-testid="balance" data-amount={amount} data-currency={currency} {...props}>
    {currency === 'usd' ? '$' : ''}
    {amount}
    {currency === 'btc' ? ' BTC' : ''}
  </div>
))

export default Balance

