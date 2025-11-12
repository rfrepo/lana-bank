import { jest } from "@jest/globals"
import { renderHook } from "@testing-library/react"
import { DepositAccountItem } from "@/app/deposit-accounts/types"
import { DepositAccountStatus } from "@/lib/graphql/generated"
import { PaginatedData } from "@/components/paginated-table"
import { getColumnsConfig } from "@/app/deposit-accounts/components/deposit-accounts-table/column-config"
import useDepositAccounts from "@/app/deposit-accounts/hooks/deposit-accounts/use-deposit-accounts"
import { useTranslations } from "next-intl"

jest.mock("next-intl", () => ({
    useTranslations: jest.fn(),
}))

export const BASE_MOCK_TRANSLATION = jest.fn((key: string) => `translated.${key}`)

export const BASE_MOCK_COLUMNS = [
    {
        key: "email",
        label: "translated.headers.customer",
        sortable: true,
        render: jest.fn(),
    },
    {
        key: "status",
        label: "translated.headers.status",
        sortable: true,
        render: jest.fn(),
    },
]

export const BASE_MOCK_PAGINATED_DATA: PaginatedData<DepositAccountItem> = {
    edges: [],
    pageInfo: {
        endCursor: "",
        startCursor: "",
        hasNextPage: false,
        hasPreviousPage: false,
    },
}

export const BASE_MOCK_FETCH_MORE = jest.fn()

export const BASE_MOCK_DEPOSIT_ACCOUNT: DepositAccountItem = {
    id: "deposit-1",
    email: "test@example.com",
    publicId: "public-123",
    depositAccountId: "uuid-deposit-1",
    status: DepositAccountStatus.Active,
    balance: {
        settled: 100000,
        pending: 5000,
    },
}

export const createMockDepositAccount = (
    overrides?: Partial<DepositAccountItem>,
): DepositAccountItem => ({
    ...BASE_MOCK_DEPOSIT_ACCOUNT,
    ...overrides,
})

export const createMockPaginatedData = (
    accounts: DepositAccountItem[],
    pageInfoOverrides?: Partial<PaginatedData<DepositAccountItem>["pageInfo"]>,
): PaginatedData<DepositAccountItem> => ({
    edges: accounts.map((account, index) => ({
        node: account,
        cursor: `cursor-${index + 1}`,
    })),
    pageInfo: {
        ...BASE_MOCK_PAGINATED_DATA.pageInfo,
        ...pageInfoOverrides,
    },
})

export const setupHook = (
    mockUseTranslations: jest.MockedFunction<typeof useTranslations>,
    mockGetColumnsConfig: jest.MockedFunction<typeof getColumnsConfig>,
    mockUseDepositAccounts: jest.MockedFunction<typeof useDepositAccounts> | jest.Mock,
    overrides?: {
        translation?: jest.Mock
        columns?: ReturnType<typeof getColumnsConfig>
        paginatedData?: PaginatedData<DepositAccountItem>
        loading?: boolean
        error?: Error
        fetchMore?: jest.Mock | ((...args: any[]) => Promise<any>)
    },
) => {
    const translation = overrides?.translation ?? BASE_MOCK_TRANSLATION
    const columns = overrides?.columns ?? BASE_MOCK_COLUMNS
    const paginatedData = overrides?.paginatedData ?? BASE_MOCK_PAGINATED_DATA
    const loading = overrides?.loading ?? false
    const error = overrides?.error
    const fetchMore = overrides?.fetchMore ?? BASE_MOCK_FETCH_MORE

    mockUseTranslations.mockReturnValue(translation as any)
    mockGetColumnsConfig.mockReturnValue(columns as any)
    mockUseDepositAccounts.mockReturnValue({
        data: paginatedData,
        loading,
        error,
        fetchMore,
    } as any)

    // Dynamically import the SUT to ensure mocks are applied
    return import("../use-deposit-account-table").then((module) => {
        const useDepositAccountsTable = module.default
        return renderHook(() => useDepositAccountsTable())
    })
}

export const setupHookSync = async (
    mockUseTranslations: jest.MockedFunction<typeof useTranslations>,
    mockGetColumnsConfig: jest.MockedFunction<typeof getColumnsConfig>,
    mockUseDepositAccounts: jest.MockedFunction<typeof useDepositAccounts> | jest.Mock,
    overrides?: {
        translation?: jest.Mock
        columns?: ReturnType<typeof getColumnsConfig>
        paginatedData?: PaginatedData<DepositAccountItem>
        loading?: boolean
        error?: Error
        fetchMore?: jest.Mock | ((...args: any[]) => Promise<any>)
    },
) => {
    const translation = overrides?.translation ?? BASE_MOCK_TRANSLATION
    const columns = overrides?.columns ?? BASE_MOCK_COLUMNS
    const paginatedData = overrides?.paginatedData ?? BASE_MOCK_PAGINATED_DATA
    const loading = overrides?.loading ?? false
    const error = overrides?.error
    const fetchMore = overrides?.fetchMore ?? BASE_MOCK_FETCH_MORE

    mockUseTranslations.mockReturnValue(translation as any)
    mockGetColumnsConfig.mockReturnValue(columns as any)
    mockUseDepositAccounts.mockReturnValue({
        data: paginatedData,
        loading,
        error,
        fetchMore,
    } as any)

    // Dynamically import the SUT to ensure mocks are applied
    const module = await import("../use-deposit-account-table")
    const useDepositAccountsTable = module.default
    return renderHook(() => useDepositAccountsTable())
}

