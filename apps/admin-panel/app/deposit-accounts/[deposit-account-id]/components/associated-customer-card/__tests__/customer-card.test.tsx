import React from 'react'
import { expect, it, describe, beforeEach } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'


import CustomerCard from '../customer-card'

import { createMockCustomer } from './helpers'

import { mockUseTranslations } from '@/jest.setup'


describe('CustomerCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render customer card with customer information', async () => {
    const mockCustomer = createMockCustomer()
    const { getByText, getByRole } = render(
      <CustomerCard customer={mockCustomer} />
    )

    await waitFor(() => {
      expect(getByText(/t-title/)).toBeDefined()
      expect(getByText(mockCustomer.email)).toBeDefined()
      expect(getByText(mockCustomer.telegramId)).toBeDefined()
      expect(getByRole('link')).toBeDefined()
    })

    expect(mockUseTranslations).toHaveBeenCalledWith('DepositAccounts.CustomerCard')

    const { mock } = mockUseTranslations
    const { results } = mock
    const lastCallIndex = results.length - 1
    const mockTranslationFn = results[lastCallIndex]?.value as jest.Mock

    expect(mockTranslationFn).toHaveBeenCalledWith('title')
    expect(mockTranslationFn).toHaveBeenCalledWith('labels.email')
    expect(mockTranslationFn).toHaveBeenCalledWith('buttonText')
  })

  it('should render customer card without telegram id when not provided', async () => {
    const mockCustomer = createMockCustomer({ telegramId: undefined })
    const { getByText, queryByText, getByRole } = render(
      <CustomerCard customer={mockCustomer} />
    )

    await waitFor(() => {
      expect(getByText(/t-title/)).toBeDefined()
      expect(getByText(mockCustomer.email)).toBeDefined()
      expect(queryByText(/t-telegram/)).toBeNull()
      expect(getByRole('link')).toBeDefined()
    })
  })
})

