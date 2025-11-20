import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'

import {
    createMockUseDepositAccountsTableReturn,
    createMockError,
} from './helpers'
import { getMockUseDepositAccountsTable } from './mocks'

const mockUseDepositAccountsTable = getMockUseDepositAccountsTable()

describe('DepositAccountsTable', () => {
    const renderTableAndAssertElements = async () => {
        const DepositAccountsTableComponent = (await import('../deposit-accounts-table')).default
        const { getByRole, getByText } = render(<DepositAccountsTableComponent />)

        await waitFor(() => {
            expect(getByRole('table')).toBeDefined()
        })

        return { getByText }
    }

    it('should render paginated table', async () => {
        mockUseDepositAccountsTable.mockReturnValue(
            createMockUseDepositAccountsTableReturn()
        )

        await renderTableAndAssertElements()
    })

    it('should render with error message', async () => {
        const error = createMockError('Test error')
        mockUseDepositAccountsTable.mockReturnValue(
            createMockUseDepositAccountsTableReturn({ error })
        )

        const { getByText } = await renderTableAndAssertElements()
        expect(getByText(error.message)).toBeDefined()
    })

    it('should render with loading state', async () => {
        mockUseDepositAccountsTable.mockReturnValue(
            createMockUseDepositAccountsTableReturn({ loading: true })
        )

        await renderTableAndAssertElements()
    })
})
