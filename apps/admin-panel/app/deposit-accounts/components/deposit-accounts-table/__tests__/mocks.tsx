import { jest } from "@jest/globals"

jest.mock('@/lib/graphql/generated', () => ({
    useCustomersWithDepositAccountsQuery: jest.fn(() => ({
        data: null,
        loading: false,
        error: null,
        fetchMore: jest.fn(),
    })),
}))

jest.mock('@/app/deposit-accounts/components/deposit-accounts-table/hooks/deposit-accounts-table/use-deposit-account-table', () => ({
    __esModule: true,
    default: jest.fn(),
}))

export const getMockUseDepositAccountsTable = () => {
    const mockedModule = jest.requireMock('@/app/deposit-accounts/components/deposit-accounts-table/hooks/deposit-accounts-table/use-deposit-account-table') as {
        default: jest.Mock
    }
    return mockedModule.default
}

