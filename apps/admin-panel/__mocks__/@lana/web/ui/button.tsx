import React from 'react'
import { jest } from '@jest/globals'

export const Button = jest.fn(({ children, variant, ...props }) => {
  const testId = props['data-testid'] || 'button'
  return (
    <button data-testid={testId} data-variant={variant} {...props}>
      {children}
    </button>
  )
})

