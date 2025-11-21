import { jest } from "@jest/globals"

import { getColumnsConfig } from "@/app/deposit-accounts/components/deposit-accounts-table/column-config"

const mockGetColumnsConfig = jest.fn() as jest.MockedFunction<typeof getColumnsConfig>

jest.mock(
    "@/app/deposit-accounts/hooks/deposit-accounts/use-deposit-accounts",
    () => ({
        __esModule: true,
        default: jest.fn(),
    }),
)

jest.mock(
    "@/app/deposit-accounts/components/deposit-accounts-table/column-config",
    () => ({
        getColumnsConfig: mockGetColumnsConfig,
    }),
)

export const getMockUseDepositAccounts = () => {
    const mockedModule = jest.requireMock("@/app/deposit-accounts/hooks/deposit-accounts/use-deposit-accounts") as {
        default: jest.Mock
    }
    return mockedModule.default
}

export { mockGetColumnsConfig }

