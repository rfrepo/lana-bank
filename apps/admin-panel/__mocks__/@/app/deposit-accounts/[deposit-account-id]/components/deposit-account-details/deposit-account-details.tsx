import React from 'react'
import { jest } from '@jest/globals'

export const DepositAccountStatusBadge = jest.fn(({ status, ...props }) => (
  <div data-testid="deposit-account-status-badge" data-status={status} {...props} />
))

