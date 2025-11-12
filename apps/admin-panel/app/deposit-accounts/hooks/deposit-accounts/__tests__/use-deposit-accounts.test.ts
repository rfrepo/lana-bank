import { expect, it, describe, beforeEach } from "@jest/globals"
import { renderHook } from "@testing-library/react"
import {
    useCustomersWithDepositAccountsQuery,
    DepositAccountStatus,
    CustomersWithDepositAccountsQuery,
} from "@/lib/graphql/generated"
import useDepositAccounts from "../use-deposit-accounts"
import { DepositAccountItem, DepositAccountsVariables } from "@/app/deposit-accounts/types"
import {
    createMockReturnValue,
    createMockCustomerNode,
    createMockCustomerWithDepositAccount,
    createMockCustomerEdge,
    createMockBalance,
    createMockDepositAccount,
    createMockPageInfo,
    createMockCustomersQuery,
    createQueryResponseWithEdges,
    createSingleCustomerEdgeResponse,
    createMultipleCustomerEdgesResponse,
    createExpectedPaginatedData,
    BASE_PAGE_INFO,
    BASE_BALANCE,
} from "./helpers"
import { UsdCents } from "@/types/scalars"

jest.mock("@/lib/graphql/generated", () => ({
    ...jest.requireActual("@/lib/graphql/generated"),
    useCustomersWithDepositAccountsQuery: jest.fn(),
}))

const mockUseCustomersWithDepositAccountsQuery =
    useCustomersWithDepositAccountsQuery as jest.MockedFunction<
        typeof useCustomersWithDepositAccountsQuery
    >

const mockQueryDataAndAssertDataIsUndefined = (
    mockDataFactory?: () => CustomersWithDepositAccountsQuery | undefined,
) => {
    const mockData = mockDataFactory?.()
    mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
        createMockReturnValue({ data: mockData }),
    )

    const { result } = renderHook(() => useDepositAccounts({ first: 10 }))

    expect(result.current.data).toBeUndefined()
}

describe("useDepositAccounts", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("query hook invocation", () => {
        it("should call useCustomersWithDepositAccountsQuery with correct variables", () => {
            const variables: DepositAccountsVariables = {
                first: 10,
                after: "cursor-123",
                sort: null,
                filter: null,
            }

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue(),
            )

            renderHook(() => useDepositAccounts(variables))

            expect(mockUseCustomersWithDepositAccountsQuery).toHaveBeenCalledWith(
                {
                    variables,
                },
            )
        })
    })

    describe("paginated data transformation", () => {
        it("should return undefined when data is undefined", () => {
            mockQueryDataAndAssertDataIsUndefined(() => undefined)
        })

        it("should return undefined when edges array is empty", () => {
            mockQueryDataAndAssertDataIsUndefined(() =>
                createMockCustomersQuery(),
            )
        })

        it("should return undefined when edges array is null", () => {
            mockQueryDataAndAssertDataIsUndefined(() =>
                createMockCustomersQuery({
                    customers: { edges: null as any },
                }),
            )
        })

        it("should transform customer edges with deposit accounts to deposit account items", () => {
            const customer1 = createMockCustomerWithDepositAccount()

            const customer2 = createMockCustomerWithDepositAccount()

            const mockData = createMultipleCustomerEdgesResponse(
                [customer1, customer2],
                ["cursor-1", "cursor-2"],
                {
                    endCursor: "cursor-2",
                    startCursor: "cursor-1",
                    hasNextPage: true,
                    hasPreviousPage: false,
                } as unknown as typeof BASE_PAGE_INFO,
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            const expectedData = createExpectedPaginatedData(
                [customer1, customer2],
                ["cursor-1", "cursor-2"],
                {
                    endCursor: "cursor-2",
                    startCursor: "cursor-1",
                    hasNextPage: true,
                    hasPreviousPage: false,
                } as unknown as typeof BASE_PAGE_INFO,
            )

            expect(result.current.data).toEqual(expectedData)
        })

        it("should filter out customers without deposit accounts", () => {
            const customerWithAccount = createMockCustomerWithDepositAccount({
                id: "customer-1",
                email: "customer1@example.com",
            })

            const customerWithoutAccount = createMockCustomerNode({
                id: "customer-2",
                email: "customer2@example.com",
                depositAccount: null,
            })

            const mockData = createMultipleCustomerEdgesResponse(
                [customerWithAccount, customerWithoutAccount],
                ["cursor-1", "cursor-2"],
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.edges).toHaveLength(1)
            expect(result.current.data?.edges[0].node.email).toBe(
                "customer1@example.com",
            )
        })

        it("should handle pageInfo with null cursors by converting to empty strings", () => {
            const customer = createMockCustomerWithDepositAccount()
            const mockData = createSingleCustomerEdgeResponse(
                customer,
                "cursor-1",
                BASE_PAGE_INFO,
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.pageInfo.endCursor).toBe("")
            expect(result.current.data?.pageInfo.startCursor).toBe("")
        })

        it("should handle pageInfo with empty string cursors", () => {
            const customer = createMockCustomerWithDepositAccount()
            const mockData = createSingleCustomerEdgeResponse(
                customer,
                "cursor-1",
                {
                    endCursor: "",
                    startCursor: "",
                    hasNextPage: true,
                    hasPreviousPage: true,
                } as unknown as typeof BASE_PAGE_INFO,
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.pageInfo.endCursor).toBe("")
            expect(result.current.data?.pageInfo.startCursor).toBe("")
            expect(result.current.data?.pageInfo.hasNextPage).toBe(true)
            expect(result.current.data?.pageInfo.hasPreviousPage).toBe(true)
        })

        it("should preserve all pageInfo properties", () => {
            const customer = createMockCustomerWithDepositAccount()
            const pageInfo = createMockPageInfo({
                endCursor: "end-cursor",
                startCursor: "start-cursor",
                hasNextPage: true,
                hasPreviousPage: true,
            })
            const mockData = createSingleCustomerEdgeResponse(
                customer,
                "cursor-1",
                pageInfo,
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.pageInfo).toEqual(pageInfo)
        })
    })

    describe("loading and error states", () => {
        it("should return loading state from query", () => {
            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ loading: true }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.loading).toBe(true)
        })

        it("should return error state from query", () => {
            const mockError = new Error("GraphQL error")

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ error: mockError as any }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.error).toBe(mockError)
        })

        it("should return fetchMore function from query", () => {
            const mockFetchMore = jest.fn()

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ fetchMore: mockFetchMore }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.fetchMore).toBe(mockFetchMore)
        })
    })

    describe("helper function behaviors", () => {
        describe("hasDepositAccount filter behavior", () => {
            it("should filter out customers with null depositAccount", () => {
                const customerWithoutAccount = createMockCustomerNode({
                    depositAccount: null,
                })

                const mockData = createSingleCustomerEdgeResponse(
                    customerWithoutAccount,
                )

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                expect(result.current.data?.edges).toHaveLength(0)
            })

            it("should filter out customers with undefined depositAccount", () => {
                const customerWithoutAccount = createMockCustomerNode({
                    depositAccount: undefined as any,
                })

                const mockData = createSingleCustomerEdgeResponse(
                    customerWithoutAccount,
                )

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                expect(result.current.data?.edges).toHaveLength(0)
            })

            it("should include customers with depositAccount.__typename === 'DepositAccount'", () => {
                const customerWithAccount = createMockCustomerWithDepositAccount()
                const mockData = createSingleCustomerEdgeResponse(
                    customerWithAccount,
                    "cursor-1",
                )

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                expect(result.current.data?.edges).toHaveLength(1)
                expect(result.current.data?.edges[0].node).toBeDefined()
            })
        })

        describe("mapCustomerToDepositAccountItem transformation behavior", () => {
            it("should correctly map all deposit account fields", () => {
                const customer = createMockCustomerWithDepositAccount({
                    email: "test@example.com",
                    depositAccount: createMockDepositAccount({
                        id: "deposit-id",
                        depositAccountId: "deposit-uuid",
                        publicId: "public-123" as any,
                        status: DepositAccountStatus.Active,
                        balance: createMockBalance({
                            settled: 50000 as UsdCents,
                            pending: 2000 as UsdCents,
                        }),
                    }),
                })

                const mockData = createSingleCustomerEdgeResponse(customer)

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                const mappedItem = result.current.data?.edges[0].node as DepositAccountItem

                expect(mappedItem).toEqual({
                    id: "deposit-id",
                    depositAccountId: "deposit-uuid",
                    publicId: "public-123",
                    status: DepositAccountStatus.Active,
                    balance: {
                        __typename: "DepositAccountBalance",
                        settled: 50000,
                        pending: 2000,
                    },
                    email: "test@example.com",
                })
            })

            it("should map email from customer node", () => {
                const customer = createMockCustomerWithDepositAccount({
                    email: "different@example.com",
                })

                const mockData = createSingleCustomerEdgeResponse(customer)

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                expect(result.current.data?.edges[0].node.email).toBe(
                    "different@example.com",
                )
            })
        })

        describe("transformCustomerEdgesToDepositAccountEdges behavior", () => {
            it("should preserve cursor values from original edges", () => {
                const customer1 = createMockCustomerWithDepositAccount({
                    id: "customer-1",
                })
                const customer2 = createMockCustomerWithDepositAccount({
                    id: "customer-2",
                })

                const mockData = createMultipleCustomerEdgesResponse(
                    [customer1, customer2],
                    ["custom-cursor-1", "custom-cursor-2"],
                )

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                expect(result.current.data?.edges[0].cursor).toBe("custom-cursor-1")
                expect(result.current.data?.edges[1].cursor).toBe("custom-cursor-2")
            })

            it("should filter and transform mixed array of customers", () => {
                const customerWithAccount1 = createMockCustomerWithDepositAccount({
                    id: "customer-1",
                    email: "customer1@example.com",
                })
                const customerWithoutAccount = createMockCustomerNode({
                    id: "customer-2",
                    email: "customer2@example.com",
                })
                const customerWithAccount2 = createMockCustomerWithDepositAccount({
                    id: "customer-3",
                    email: "customer3@example.com",
                })

                const mockData = createMultipleCustomerEdgesResponse(
                    [customerWithAccount1, customerWithoutAccount, customerWithAccount2],
                    ["cursor-1", "cursor-2", "cursor-3"],
                )

                mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                    createMockReturnValue({ data: mockData }),
                )

                const { result } = renderHook(() =>
                    useDepositAccounts({ first: 10 }),
                )

                expect(result.current.data?.edges).toHaveLength(2)
                expect(result.current.data?.edges[0].node.email).toBe(
                    "customer1@example.com",
                )
                expect(result.current.data?.edges[1].node.email).toBe(
                    "customer3@example.com",
                )
                expect(result.current.data?.edges[0].cursor).toBe("cursor-1")
                expect(result.current.data?.edges[1].cursor).toBe("cursor-3")
            })
        })
    })

    describe("edge cases", () => {
        it("should handle customer with depositAccount that is not DepositAccount type", () => {
            const customerWithNullAccount = createMockCustomerNode({
                id: "customer-1",
                email: "customer1@example.com",
                depositAccount: null,
            })

            const customerWithAccount = createMockCustomerWithDepositAccount({
                id: "customer-2",
                email: "customer2@example.com",
            })

            const mockData = createMultipleCustomerEdgesResponse(
                [customerWithNullAccount, customerWithAccount],
                ["cursor-1", "cursor-2"],
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.edges).toHaveLength(1)
            expect(result.current.data?.edges[0].node.email).toBe(
                "customer2@example.com",
            )
        })

        it("should handle all deposit account statuses", () => {
            const statuses = [
                DepositAccountStatus.Active,
                DepositAccountStatus.Frozen,
                DepositAccountStatus.Inactive,
            ]

            const customers = statuses.map((status, index) =>
                createMockCustomerWithDepositAccount({
                    id: `customer-${index + 1}`,
                    email: `customer${index + 1}@example.com`,
                    depositAccount: createMockDepositAccount({
                        id: `deposit-account-${index + 1}`,
                        depositAccountId: `uuid-deposit-account-${index + 1}`,
                        publicId: `${index + 1}0000` as any,
                        status,
                    }),
                }),
            )

            const mockData = createMultipleCustomerEdgesResponse(
                customers,
                undefined,
                {
                    endCursor: "cursor-3",
                    startCursor: "cursor-1",
                },
            )

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.edges).toHaveLength(3)
            expect(result.current.data?.edges[0].node.status).toBe(
                DepositAccountStatus.Active,
            )
            expect(result.current.data?.edges[1].node.status).toBe(
                DepositAccountStatus.Frozen,
            )
            expect(result.current.data?.edges[2].node.status).toBe(
                DepositAccountStatus.Inactive,
            )
        })

        it("should handle empty balance values", () => {
            const customer = createMockCustomerWithDepositAccount({
                depositAccount: createMockDepositAccount({
                    balance: createMockBalance({
                        settled: 0 as UsdCents,
                        pending: 0 as UsdCents,
                    }),
                }),
            })

            const mockData = createSingleCustomerEdgeResponse(customer)

            mockUseCustomersWithDepositAccountsQuery.mockReturnValue(
                createMockReturnValue({ data: mockData }),
            )

            const { result } = renderHook(() =>
                useDepositAccounts({ first: 10 }),
            )

            expect(result.current.data?.edges[0].node.balance).toEqual({
                __typename: "DepositAccountBalance",
                settled: 0,
                pending: 0,
            })
        })
    })
})

