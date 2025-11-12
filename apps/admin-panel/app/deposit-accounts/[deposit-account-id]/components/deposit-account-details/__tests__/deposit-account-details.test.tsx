import React from 'react'
import { expect, it, describe, jest } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
// Dynamically import the component to ensure mocks are applied
import { DepositAccountStatus } from '@/lib/graphql/generated'
import { createMockDepositAccount } from './helpers'

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockRefresh = jest.fn()
const mockBack = jest.fn()
const mockForward = jest.fn()
const mockPrefetch = jest.fn()

const mockRouter = {
  push: mockPush,
  replace: mockReplace,
  refresh: mockRefresh,
  back: mockBack,
  forward: mockForward,
  prefetch: mockPrefetch,
}

// Router is already mocked globally in jest.setup.ts

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace: string) => (key: string) => `${namespace}.${key}`),
}))

jest.mock('@/app/deposit-accounts/[deposit-account-id]/components/freeze-deposit-account/freeze-deposit-account', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="freeze-deposit-account-dialog" />),
  FreezeDepositAccountDialog: jest.fn(() => <div data-testid="freeze-deposit-account-dialog" />),
}))

jest.mock('@/app/deposit-accounts/[deposit-account-id]/components/unfreeze-deposit-account/unfreeze-deposit-account', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="unfreeze-deposit-account-dialog" />),
  UnfreezeDepositAccountDialog: jest.fn(() => <div data-testid="unfreeze-deposit-account-dialog" />),
}))

jest.mock('@/components/balance/balance', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div data-testid="balance" />),
}))

jest.mock('@/components/details', () => ({
  DetailsCard: jest.fn().mockReturnValue(<div data-testid="details-card" />),
  DetailItemProps: {},
}))

jest.mock('@lana/web/ui/badge', () => ({
  Badge: jest.fn(({ children, ...props }) => (
    <div data-testid="badge" {...props}>
      {children}
    </div>
  )),
}))

jest.mock('@lana/web/ui/button', () => ({
  Button: jest.fn().mockReturnValue(<button data-testid="button" />),
}))

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
}))

jest.mock('@/lib/graphql/generated', () => {
  const actual = jest.requireActual('@/lib/graphql/generated')
  return {
    ...actual,
    useDepositAccountFreezeMutation: jest.fn(() => [
      jest.fn(),
      { loading: false, reset: jest.fn() },
    ]),
    useDepositAccountUnfreezeMutation: jest.fn(() => [
      jest.fn(),
      { loading: false, reset: jest.fn() },
    ]),
    GetCustomerBasicDetailsDocument: {},
  }
})

describe('DepositAccountDetails', () => {
  it('should render details card and dialogs', async () => {
    const mockDepositAccount = createMockDepositAccount()
    const DepositAccountDetailsComponent = (await import('../deposit-account-details')).default
    const { getByTestId } = render(
      <DepositAccountDetailsComponent depositAccount={mockDepositAccount} />
    )

    await waitFor(() => {
      expect(getByTestId('details-card')).toBeDefined()
      expect(getByTestId('freeze-deposit-account-dialog')).toBeDefined()
      expect(getByTestId('unfreeze-deposit-account-dialog')).toBeDefined()
    })
  })

  it('should render with frozen status', async () => {
    const frozenAccount = createMockDepositAccount({
      status: DepositAccountStatus.Frozen,
    })
    const DepositAccountDetailsComponent = (await import('../deposit-account-details')).default
    const { getByTestId } = render(
      <DepositAccountDetailsComponent depositAccount={frozenAccount} />
    )

    await waitFor(() => {
      expect(getByTestId('details-card')).toBeDefined()
    })
  })
})

describe('DepositAccountStatusBadge', () => {
  it('should render badge for active status', async () => {
    const { DepositAccountStatusBadge: DepositAccountStatusBadgeComponent } = await import('../deposit-account-details')
    const { getByTestId } = render(
      <DepositAccountStatusBadgeComponent status={DepositAccountStatus.Active} />
    )

    await waitFor(() => {
      expect(getByTestId('badge')).toBeDefined()
    })
  })

  it('should render badge for frozen status', async () => {
    const { DepositAccountStatusBadge: DepositAccountStatusBadgeComponent } = await import('../deposit-account-details')
    const { getByTestId } = render(
      <DepositAccountStatusBadgeComponent status={DepositAccountStatus.Frozen} />
    )

    await waitFor(() => {
      expect(getByTestId('badge')).toBeDefined()
    })
  })

  it('should render badge for inactive status', async () => {
    const { DepositAccountStatusBadge: DepositAccountStatusBadgeComponent } = await import('../deposit-account-details')
    const { getByTestId } = render(
      <DepositAccountStatusBadgeComponent status={DepositAccountStatus.Inactive} />
    )

    await waitFor(() => {
      expect(getByTestId('badge')).toBeDefined()
    })
  })
})
