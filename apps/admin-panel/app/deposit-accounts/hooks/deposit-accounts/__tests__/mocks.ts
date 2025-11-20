import { jest } from "@jest/globals"

import { useCustomersWithDepositAccountsQuery } from "@/lib/graphql/generated"

jest.mock("@/lib/graphql/generated", () => {
    const actual = jest.requireActual("@/lib/graphql/generated") as Record<string, unknown>
    return {
        ...actual,
        useCustomersWithDepositAccountsQuery: jest.fn(),
    }
})

export const getMockUseCustomersWithDepositAccountsQuery = () => {
    const mockedModule = jest.requireMock("@/lib/graphql/generated") as {
        useCustomersWithDepositAccountsQuery: jest.MockedFunction<
            typeof useCustomersWithDepositAccountsQuery
        >
    }
    return mockedModule.useCustomersWithDepositAccountsQuery
}

