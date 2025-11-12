import {
    DepositAccountStatus,
    CustomersWithDepositAccountsQuery,
    useCustomersWithDepositAccountsQuery,
} from "@/lib/graphql/generated"
import {
    CustomerNode,
    CustomerEdge,
    CustomerWithDepositAccountNode,
    DepositAccountItem,
    DepositAccountNode,
} from "@/app/deposit-accounts/types"
import { UsdCents } from "@/types/scalars"
import { PaginatedData } from "@/components/paginated-table"

export const BASE_PAGE_INFO = {
    __typename: "PageInfo",
    endCursor: null,
    startCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
}

export const BASE_BALANCE = {
    __typename: "DepositAccountBalance" as const,
    settled: 100000 as UsdCents,
    pending: 5000 as UsdCents,
} as const

export const BASE_DEPOSIT_ACCOUNT = {
    __typename: "DepositAccount" as const,
    id: "deposit-account-1",
    depositAccountId: "uuid-deposit-account-1",
    publicId: "12345" as any,
    status: DepositAccountStatus.Active,
    balance: BASE_BALANCE,
}

export const BASE_CUSTOMER = {
    __typename: "Customer" as const,
    id: "customer-1",
    customerId: "uuid-customer-1",
    email: "test@example.com",
} as const

export const BASE_QUERY_RESPONSE = {
    __typename: "Query" as const,
    customers: {
        __typename: "CustomerConnection" as const,
        edges: [],
        pageInfo: BASE_PAGE_INFO,
    },
} as const

export const BASE_QUERY_RETURN_VALUE = {
    data: undefined,
    loading: false,
    error: undefined,
    fetchMore: jest.fn(),
}

export const createMockReturnValue = (
    overrides?: Partial<
        ReturnType<typeof useCustomersWithDepositAccountsQuery>
    >,
) => ({
    ...BASE_QUERY_RETURN_VALUE,
    ...overrides,
})

export const createMockBalance = (
    overrides?: Partial<typeof BASE_BALANCE>,
) => ({
    ...BASE_BALANCE,
    ...overrides,
})

export const createMockDepositAccount = (
    overrides?: Partial<typeof BASE_DEPOSIT_ACCOUNT>,
) => ({
    ...BASE_DEPOSIT_ACCOUNT,
    balance: overrides?.balance
        ? { ...BASE_BALANCE, ...overrides.balance }
        : BASE_BALANCE,
    ...overrides,
})

export const createMockCustomerNode = (
    overrides?: Partial<CustomerNode>,
): CustomerNode => ({
    ...BASE_CUSTOMER,
    depositAccount: null,
    ...overrides,
})

export const createMockCustomerWithDepositAccount = (
    overrides?: Partial<CustomerWithDepositAccountNode>,
): CustomerWithDepositAccountNode => {
    const depositAccountValue = (overrides as unknown as { depositAccount?: DepositAccountNode })?.depositAccount
    const depositAccount = depositAccountValue ?? createMockDepositAccount()
    return {
        ...BASE_CUSTOMER,
        ...(overrides ? (overrides as Record<string, unknown>) : {}),
        depositAccount,
    } as CustomerWithDepositAccountNode
}

export const createMockCustomerEdge = (
    node: CustomerNode,
    cursor: string = "cursor-1",
): CustomerEdge => ({
    __typename: "CustomerEdge" as const,
    node,
    cursor,
})

export const createMockPageInfo = (
    overrides?: Partial<typeof BASE_PAGE_INFO>,
) => ({
    ...BASE_PAGE_INFO,
    ...overrides,
})

export const createMockCustomersQuery = (
    overrides?: Partial<CustomersWithDepositAccountsQuery>,
): CustomersWithDepositAccountsQuery => {
    const { customers, ...rest } = overrides || {}
    const { edges, pageInfo, ...customersRest } = customers || {}

    return {
        ...BASE_QUERY_RESPONSE,
        ...rest,
        customers: {
            ...BASE_QUERY_RESPONSE.customers,
            ...customersRest,
            edges: edges ?? [],
            pageInfo: createMockPageInfo(pageInfo),
        },
    }
}

export const createQueryResponseWithEdges = (
    edges: CustomerEdge[],
    pageInfoOverrides?: Partial<typeof BASE_PAGE_INFO>,
): CustomersWithDepositAccountsQuery =>
    createMockCustomersQuery({
        customers: {
            edges,
            pageInfo: createMockPageInfo(pageInfoOverrides),
        },
    })

export const createSingleCustomerEdgeResponse = (
    customer: CustomerNode | CustomerWithDepositAccountNode,
    cursor: string = "cursor-1",
    pageInfoOverrides?: Partial<typeof BASE_PAGE_INFO>,
): CustomersWithDepositAccountsQuery =>
    createQueryResponseWithEdges(
        [createMockCustomerEdge(customer, cursor)],
        pageInfoOverrides,
    )

export const createMultipleCustomerEdgesResponse = (
    customers: Array<CustomerNode | CustomerWithDepositAccountNode>,
    cursors?: string[],
    pageInfoOverrides?: Partial<typeof BASE_PAGE_INFO>,
): CustomersWithDepositAccountsQuery => {
    const edges = customers.map((customer, index) =>
        createMockCustomerEdge(
            customer,
            cursors?.[index] ?? `cursor-${index + 1}`,
        ),
    )

    return createQueryResponseWithEdges(edges, pageInfoOverrides)
}

export const createExpectedPaginatedData = (
    customers: CustomerWithDepositAccountNode[],
    cursors: string[],
    pageInfoOverrides?: Partial<typeof BASE_PAGE_INFO>,
): PaginatedData<DepositAccountItem> => {
    const pageInfo = createMockPageInfo(pageInfoOverrides)

    return {
        edges: customers.map((customer, index) => {
            const { depositAccount, email } = customer

            const { id, depositAccountId, publicId, status, balance } = depositAccount

            return {
                node: {
                    id,
                    email,
                    status,
                    balance,
                    publicId,
                    depositAccountId,
                },
                cursor: cursors[index] ?? `cursor-${index + 1}`,
            }
        }),
        pageInfo: {
            ...pageInfo,
            endCursor: pageInfo.endCursor ?? "",
            startCursor: pageInfo.startCursor ?? "",
        },
    }
}

