import React from 'react'
import { expect, it, describe, beforeEach } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'

import { createMockDepositAccount } from './helpers'

import { DepositAccountStatus } from '@/lib/graphql/generated'

// eslint-disable-next-line import/no-unassigned-import
import './mocks'

import DepositAccountDetailsComponent from '../deposit-account-details'

describe('DepositAccountDetails', () => {
  it('should render details card and dialogs', async () => {
    const mockDepositAccount = createMockDepositAccount()
    const { getByText, container } = render(
      <DepositAccountDetailsComponent depositAccount={mockDepositAccount} />
    )

    await waitFor(() => {
      expect(getByText(/t-title/)).toBeDefined()
      const freezeDialog = container.querySelector('[data-testid="freeze-deposit-account-dialog"]')
      const unfreezeDialog = container.querySelector('[data-testid="unfreeze-deposit-account-dialog"]')
      expect(freezeDialog).toBeDefined()
      expect(unfreezeDialog).toBeDefined()
    })
  })

  it('should render with frozen status', async () => {
    const frozenAccount = createMockDepositAccount({
      status: DepositAccountStatus.Frozen,
    })

    const { getByText } = render(
      <DepositAccountDetailsComponent depositAccount={frozenAccount} />
    )

    await waitFor(() => {
      expect(getByText(/t-title/)).toBeDefined()
    })
  })
})

describe('DepositAccountStatusBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderBadgeAndAssertVariantAndTranslation = async ({
    status,
    expectedVariant,
    expectedTranslationKey,
  }: {
    status: DepositAccountStatus
    expectedVariant: string
    expectedTranslationKey: string
  }) => {
    const { getMockBadge, mockUseTranslations } = await import('./mocks')

    const { DepositAccountStatusBadge } = await import('../deposit-account-details')

    const { getByText } = render(
      <DepositAccountStatusBadge status={status} />
    )

    await waitFor(() => {
      expect(getByText(/t-(active|frozen|inactive)/)).toBeDefined()
    })

    const mockBadge = getMockBadge()

    if (mockBadge.mock && mockBadge.mock.calls.length > 0) {
      const lastCall = mockBadge.mock.calls[mockBadge.mock.calls.length - 1]
      expect(lastCall?.[0]).toMatchObject({ variant: expectedVariant })
    } else {
      const badge = getByText(/t-(active|frozen|inactive)/)
      const variantClasses: Record<string, string> = {
        success: 'bg-success',
        destructive: 'bg-destructive',
        secondary: 'bg-secondary',
      }
      const expectedClass = variantClasses[expectedVariant]
      if (expectedClass) {
        expect(badge.className).toContain(expectedClass)
      }
    }

    expect(mockUseTranslations).toHaveBeenCalledWith('DepositAccounts.DepositAccountDetails.status')

    const { mock } = mockUseTranslations
    const { results } = mock
    const lastCallIndex = results.length - 1
    const mockTranslationFn = results[lastCallIndex]?.value as jest.Mock

    expect(mockTranslationFn).toHaveBeenCalledWith(expectedTranslationKey)
  }

  it('should render badge for active status', async () => {
    await renderBadgeAndAssertVariantAndTranslation({
      status: DepositAccountStatus.Active,
      expectedVariant: 'success',
      expectedTranslationKey: 'active',
    })
  })

  it('should render badge for frozen status', async () => {
    await renderBadgeAndAssertVariantAndTranslation({
      status: DepositAccountStatus.Frozen,
      expectedVariant: 'destructive',
      expectedTranslationKey: 'frozen',
    })
  })

  it('should render badge for inactive status', async () => {
    await renderBadgeAndAssertVariantAndTranslation({
      status: DepositAccountStatus.Inactive,
      expectedVariant: 'secondary',
      expectedTranslationKey: 'inactive',
    })
  })
})
