import React from 'react'
import { expect, it, describe, jest } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
// Dynamically import the component to ensure mocks are applied
import { createMockUnfreezeDialogProps } from './helpers'

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace: string) => (key: string) => `${namespace}.${key}`),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
  ApolloProvider: jest.fn(({ children }) => children),
}))

const mockUnfreezeMutation = jest.fn()
const mockReset = jest.fn()

jest.mock('@/lib/graphql/generated', () => ({
  GetCustomerBasicDetailsDocument: {},
  useDepositAccountUnfreezeMutation: jest.fn(() => [
    mockUnfreezeMutation,
    { loading: false, reset: mockReset },
  ]),
}))

jest.mock('@lana/web/ui/dialog', () => ({
  Dialog: jest.fn(({ children, open }) => (open ? <div data-testid="dialog">{children}</div> : null)),
  DialogContent: jest.fn(({ children }) => <div data-testid="dialog-content">{children}</div>),
  DialogDescription: jest.fn(({ children }) => <div data-testid="dialog-description">{children}</div>),
  DialogFooter: jest.fn(({ children }) => <div data-testid="dialog-footer">{children}</div>),
  DialogHeader: jest.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: jest.fn(({ children }) => <div data-testid="dialog-title">{children}</div>),
}))

jest.mock('@lana/web/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => (
    <button data-testid="unfreeze-deposit-account-dialog-button" {...props}>
      {children}
    </button>
  )),
}))

describe('UnfreezeDepositAccountDialog', () => {
  it('should render dialog when open', async () => {
    const props = createMockUnfreezeDialogProps()
    const UnfreezeDepositAccountDialogComponent = (await import('../unfreeze-deposit-account')).default
    const { getByTestId } = render(<UnfreezeDepositAccountDialogComponent {...props} />)

    await waitFor(() => {
      expect(getByTestId('dialog')).toBeDefined()
      expect(getByTestId('dialog-content')).toBeDefined()
      expect(getByTestId('dialog-header')).toBeDefined()
      expect(getByTestId('dialog-title')).toBeDefined()
      expect(getByTestId('dialog-description')).toBeDefined()
      expect(getByTestId('dialog-footer')).toBeDefined()
      expect(getByTestId('unfreeze-deposit-account-dialog-button')).toBeDefined()
    })
  })

  it('should not render dialog when closed', async () => {
    const props = createMockUnfreezeDialogProps({ openUnfreezeDialog: false })
    const UnfreezeDepositAccountDialogComponent = (await import('../unfreeze-deposit-account')).default
    const { queryByTestId } = render(<UnfreezeDepositAccountDialogComponent {...props} />)

    expect(queryByTestId('dialog')).toBeNull()
  })

  it('should render button text in the DOM', async () => {
    const props = createMockUnfreezeDialogProps()
    const UnfreezeDepositAccountDialogComponent = (await import('../unfreeze-deposit-account')).default
    const { getByTestId } = render(<UnfreezeDepositAccountDialogComponent {...props} />)

    await waitFor(() => {
      expect(getByTestId('unfreeze-deposit-account-dialog-button')).toBeDefined()
    })
  })
})
