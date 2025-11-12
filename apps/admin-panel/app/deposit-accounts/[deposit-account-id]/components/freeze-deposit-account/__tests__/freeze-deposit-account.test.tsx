import React from 'react'
import { expect, it, describe, jest } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
// Dynamically import the component to ensure mocks are applied
import { createMockFreezeDialogProps } from './helpers'

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

const mockFreezeMutation = jest.fn()
const mockReset = jest.fn()

jest.mock('@/lib/graphql/generated', () => ({
  GetCustomerBasicDetailsDocument: {},
  useDepositAccountFreezeMutation: jest.fn(() => [
    mockFreezeMutation,
    { loading: false, reset: mockReset },
  ]),
  GetCustomerBasicDetailsQuery: {},
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
    <button data-testid="freeze-deposit-account-dialog-button" {...props}>
      {children}
    </button>
  )),
}))

jest.mock('@/components/details', () => ({
  DetailItem: jest.fn(({ children }) => <div data-testid="detail-item">{children}</div>),
  DetailsGroup: jest.fn(({ children }) => <div data-testid="details-group">{children}</div>),
}))

jest.mock('@/components/balance/balance', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div data-testid="balance" />),
}))

describe('FreezeDepositAccountDialog', () => {
  it('should render dialog when open', async () => {
    const props = createMockFreezeDialogProps()
    const FreezeDepositAccountDialogComponent = (await import('../freeze-deposit-account')).default
    const { getByTestId } = render(<FreezeDepositAccountDialogComponent {...props} />)

    await waitFor(() => {
      expect(getByTestId('dialog')).toBeDefined()
      expect(getByTestId('dialog-content')).toBeDefined()
      expect(getByTestId('dialog-header')).toBeDefined()
      expect(getByTestId('dialog-title')).toBeDefined()
      expect(getByTestId('dialog-description')).toBeDefined()
      expect(getByTestId('details-group')).toBeDefined()
      expect(getByTestId('freeze-deposit-account-dialog-button')).toBeDefined()
    })
  })

  it('should not render dialog when closed', async () => {
    const props = createMockFreezeDialogProps({ openFreezeDialog: false })
    const FreezeDepositAccountDialogComponent = (await import('../freeze-deposit-account')).default
    const { queryByTestId } = render(<FreezeDepositAccountDialogComponent {...props} />)

    expect(queryByTestId('dialog')).toBeNull()
  })

  it('should render balance details in the DOM', async () => {
    const props = createMockFreezeDialogProps()
    const FreezeDepositAccountDialogComponent = (await import('../freeze-deposit-account')).default
    const { getAllByTestId } = render(<FreezeDepositAccountDialogComponent {...props} />)

    await waitFor(() => {
      expect(getAllByTestId('details-group')).toBeDefined()
      expect(getAllByTestId('detail-item').length).toBeGreaterThan(0)
    })
  })
})
