import React from 'react'
import { expect, it, describe, beforeEach } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'

import DepositAccountCard from '../deposit-account-card'

import { createMockDepositAccount } from './helpers'

import { DepositAccountStatus } from '@/lib/graphql/generated'
import type { UsdCents } from '@/types'


describe('DepositAccountCard', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render deposit account card with status and balance', async () => {
        const mockDepositAccount = createMockDepositAccount()
        const { getByText, getByRole } = render(
            <DepositAccountCard depositAccount={mockDepositAccount} />
        )

        await waitFor(() => {
            expect(getByText(/t-title/)).toBeDefined()
            expect(getByText(/t-status/)).toBeDefined()
            expect(getByText(/t-balance/)).toBeDefined()
            expect(getByText(/t-(active|frozen|inactive)/)).toBeDefined()
            expect(getByRole('button', { name: /t-buttonText/ })).toBeDefined()
        })
    })

    it('should render null when depositAccount is null', () => {
        const { container } = render(<DepositAccountCard depositAccount={null} />)
        expect(container.firstChild).toBeNull()
    })

    it('should render with correct link href', async () => {
        const mockDepositAccount = createMockDepositAccount({
            publicId: 'test-account-id',
        })
        const { getByRole } = render(
            <DepositAccountCard depositAccount={mockDepositAccount} />
        )

        await waitFor(() => {
            const link = getByRole('link')
            expect(link).toBeDefined()
            expect(link.getAttribute('href')).toBe('/deposit-accounts/test-account-id')
        })
    })

    it('should render balance with correct amount', async () => {
        const mockDepositAccount = createMockDepositAccount({
            balance: {
                __typename: 'DepositAccountBalance',
                settled: 5000 as UsdCents,
                pending: 1000 as UsdCents,
            },
        })
        const { getByText } = render(
            <DepositAccountCard depositAccount={mockDepositAccount} />
        )

        await waitFor(() => {
            expect(getByText(/t-balance/)).toBeDefined()
            expect(getByText(/50\.00/)).toBeDefined()
        })
    })

    it('should render status badge with correct status', async () => {
        const mockDepositAccount = createMockDepositAccount({
            status: DepositAccountStatus.Frozen,
        })
        const { getByText } = render(
            <DepositAccountCard depositAccount={mockDepositAccount} />
        )

        await waitFor(() => {
            expect(getByText(/t-frozen/)).toBeDefined()
        })
    })
})

