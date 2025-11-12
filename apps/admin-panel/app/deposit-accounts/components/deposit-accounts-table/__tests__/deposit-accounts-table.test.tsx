import React from 'react'
import { expect, it, describe, beforeEach, jest } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
// Dynamically import the component to ensure mocks are applied
import useDepositAccountsTable from '@/app/deposit-accounts/hooks/deposit-accounts-table/use-deposit-account-table'
import {
    createMockUseDepositAccountsTableReturn,
    createMockError,
} from './helpers'

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
}))

jest.mock('@/lib/graphql/generated', () => ({
    useCustomersWithDepositAccountsQuery: jest.fn(() => ({
        data: null,
        loading: false,
        error: null,
        fetchMore: jest.fn(),
    })),
}))

jest.mock('@/components/paginated-table', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue(<div data-testid="paginated-table" />),
}))

jest.mock('@/components/inline-error-text', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue(<div data-testid="inline-error-text" />),
}))

jest.mock('@/app/deposit-accounts/hooks/deposit-accounts-table/use-deposit-account-table', () => ({
    __esModule: true,
    default: jest.fn(),
}))

const mockUseDepositAccountsTable = require('@/app/deposit-accounts/hooks/deposit-accounts-table/use-deposit-account-table').default as jest.Mock

describe('DepositAccountsTable', () => {
    beforeEach(() => {
        mockUseDepositAccountsTable.mockReturnValue(
            createMockUseDepositAccountsTableReturn()
        )
    })

    it('should render inline error text and paginated table', async () => {
        const DepositAccountsTableComponent = (await import('../deposit-accounts-table')).default
        const { getByTestId } = render(<DepositAccountsTableComponent />)

        await waitFor(() => {
            expect(getByTestId('inline-error-text')).toBeDefined()
            expect(getByTestId('paginated-table')).toBeDefined()
        })
    })

    it('should render with error message', async () => {
        mockUseDepositAccountsTable.mockReturnValue(
            createMockUseDepositAccountsTableReturn({
                error: createMockError('Test error'),
            })
        )

        const DepositAccountsTableComponent = (await import('../deposit-accounts-table')).default
        const { getByTestId } = render(<DepositAccountsTableComponent />)

        await waitFor(() => {
            expect(getByTestId('inline-error-text')).toBeDefined()
            expect(getByTestId('paginated-table')).toBeDefined()
        })
    })

    it('should render with loading state', async () => {
        mockUseDepositAccountsTable.mockReturnValue(
            createMockUseDepositAccountsTableReturn({
                loading: true,
            })
        )

        const DepositAccountsTableComponent = (await import('../deposit-accounts-table')).default
        const { getByTestId } = render(<DepositAccountsTableComponent />)

        await waitFor(() => {
            expect(getByTestId('paginated-table')).toBeDefined()
        })
    })
})
