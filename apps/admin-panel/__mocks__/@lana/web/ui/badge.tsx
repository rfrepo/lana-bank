import React from 'react'
import { jest } from '@jest/globals'

export const Badge = jest.fn(({ children, ...props }) => (
  <div data-testid="badge" {...props}>
    {children}
  </div>
))

