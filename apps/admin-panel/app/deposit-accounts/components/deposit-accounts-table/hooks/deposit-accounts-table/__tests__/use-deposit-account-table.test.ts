import { expect, it, describe, beforeEach, jest } from "@jest/globals"
import { act } from 'react'

import { useTranslations } from "next-intl"

import {
    createMockDepositAccount,
    createMockPaginatedData,
    setupHookSync,
} from "./helpers"
import { getMockUseDepositAccounts, mockGetColumnsConfig } from "./mocks"

import { DepositAccountStatus, CustomersSortBy, SortDirection } from "@/lib/graphql/generated"

const mockUseDepositAccountsFn = getMockUseDepositAccounts()

const mockUseTranslations = useTranslations as jest.MockedFunction<
    typeof useTranslations
>

describe("useDepositAccountsTable", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseDepositAccountsFn.mockReturnValue({
            data: undefined,
            loading: false,
            error: null,
            fetchMore: jest.fn(),
        })
    })

    describe("initialization", () => {
        it("should call useTranslations with correct namespace", async () => {
            await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            expect(mockUseTranslations).toHaveBeenCalledWith("DepositAccounts.table")
        })

        it("should call useDepositAccounts with initial variables", async () => {
            await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            expect(mockUseDepositAccountsFn).toHaveBeenCalledWith({
                first: 10,
                sort: null,
            })
        })

        it("should call getColumnsConfig with translation function", async () => {
            const mockTranslation = jest.fn((key: string) => `translated.${key}`)
            await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { translation: mockTranslation as any },
            )

            expect(mockGetColumnsConfig).toHaveBeenCalledWith(mockTranslation as any)
        })

        it("should return columns from getColumnsConfig", async () => {
            const customColumns = [
                {
                    key: "custom",
                    label: "Custom Label",
                    sortable: false,
                    render: jest.fn(),
                },
            ]
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { columns: customColumns as any },
            )

            expect(result.current.columns).toEqual(customColumns)
        })

        it("should return loading state from useDepositAccounts", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { loading: true },
            )

            expect(result.current.loading).toBe(true)
        })

        it("should return error state from useDepositAccounts", async () => {
            const mockError = new Error("Test error")
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { error: mockError },
            )

            expect(result.current.error).toBe(mockError)
        })

        it("should return paginatedData from useDepositAccounts", async () => {
            const customData = createMockPaginatedData([
                createMockDepositAccount({ email: "custom@example.com" }),
            ])
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { paginatedData: customData },
            )

            expect(result.current.paginatedData).toEqual(customData)
        })
    })

    describe("handleSort", () => {
        it("should update sortBy state when handleSort is called", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            act(() => {
                result.current.handleSort("email", "ASC")
            })

            expect(mockUseDepositAccountsFn).toHaveBeenLastCalledWith({
                first: 10,
                sort: {
                    by: CustomersSortBy.Email,
                    direction: SortDirection.Asc,
                },
            })
        })

        it("should handle different sort directions", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            act(() => {
                result.current.handleSort("email", "ASC")
            })

            expect(mockUseDepositAccountsFn).toHaveBeenLastCalledWith({
                first: 10,
                sort: {
                    by: CustomersSortBy.Email,
                    direction: SortDirection.Asc,
                },
            })

            act(() => {
                result.current.handleSort("email", "DESC")
            })

            expect(mockUseDepositAccountsFn).toHaveBeenLastCalledWith({
                first: 10,
                sort: {
                    by: CustomersSortBy.Email,
                    direction: SortDirection.Desc,
                },
            })
        })

        it("should handle multiple sort changes", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            act(() => {
                result.current.handleSort("email", "ASC")
            })

            act(() => {
                result.current.handleSort("email", "DESC")
            })

            expect(mockUseDepositAccountsFn).toHaveBeenLastCalledWith({
                first: 10,
                sort: {
                    by: CustomersSortBy.Email,
                    direction: SortDirection.Desc,
                },
            })
        })
    })

    describe("fetchMoreAccounts", () => {
        it("should call fetchMore with correct cursor", async () => {
            const mockFetchMore = jest.fn().mockImplementation(() => Promise.resolve()) as jest.Mock
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { fetchMore: mockFetchMore },
            )

            await act(async () => {
                await result.current.fetchMoreAccounts("cursor-123")
            })

            expect(mockFetchMore).toHaveBeenCalledWith({
                variables: { after: "cursor-123" },
            })
        })

        it("should handle multiple fetchMore calls with different cursors", async () => {
            const mockFetchMore = jest.fn().mockImplementation(() => Promise.resolve()) as jest.Mock
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { fetchMore: mockFetchMore },
            )

            await act(async () => {
                await result.current.fetchMoreAccounts("cursor-1")
            })

            await act(async () => {
                await result.current.fetchMoreAccounts("cursor-2")
            })

            expect(mockFetchMore).toHaveBeenCalledTimes(2)
            expect(mockFetchMore).toHaveBeenNthCalledWith(1, {
                variables: { after: "cursor-1" },
            })
            expect(mockFetchMore).toHaveBeenNthCalledWith(2, {
                variables: { after: "cursor-2" },
            })
        })

        it("should handle empty cursor string", async () => {
            const mockFetchMore = jest.fn().mockImplementation(() => Promise.resolve()) as jest.Mock
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { fetchMore: mockFetchMore },
            )

            await act(async () => {
                await result.current.fetchMoreAccounts("")
            })

            expect(mockFetchMore).toHaveBeenCalledWith({
                variables: { after: "" },
            })
        })
    })

    describe("navigateToAccountDetails", () => {
        it("should return correct route with account publicId", async () => {
            const account = createMockDepositAccount({ publicId: "public-456" })
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            const route = result.current.navigateToAccountDetails(account)

            expect(route).toBe("/deposit-accounts/public-456")
        })

        it("should handle different publicIds", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            const account1 = createMockDepositAccount({ publicId: "account-1" })
            const account2 = createMockDepositAccount({ publicId: "account-2" })

            expect(result.current.navigateToAccountDetails(account1)).toBe(
                "/deposit-accounts/account-1",
            )
            expect(result.current.navigateToAccountDetails(account2)).toBe(
                "/deposit-accounts/account-2",
            )
        })

        it("should handle accounts with different properties", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            const account = createMockDepositAccount({
                id: "deposit-999",
                email: "different@example.com",
                publicId: "unique-id",
                depositAccountId: "uuid-999",
                status: DepositAccountStatus.Frozen,
            })

            const route = result.current.navigateToAccountDetails(account)

            expect(route).toBe("/deposit-accounts/unique-id")
        })
    })

    describe("columns memoization", () => {
        it("should memoize columns based on translation function", async () => {
            const mockTranslation1 = jest.fn((key: string) => `translated.${key}`)
            const { result, rerender } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { translation: mockTranslation1 as any },
            )

            const columns1 = result.current.columns

            rerender()

            expect(result.current.columns).toBe(columns1)
            expect(mockGetColumnsConfig).toHaveBeenCalledTimes(1)
        })

        it("should recalculate columns when translation function changes", async () => {
            const mockTranslation1 = jest.fn((key: string) => `translated.${key}`)
            const { rerender } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                { translation: mockTranslation1 as any },
            )

            const mockTranslation2 = jest.fn((key: string) => `new.${key}`)
            mockUseTranslations.mockReturnValue(mockTranslation2 as any)

            rerender()

            expect(mockGetColumnsConfig).toHaveBeenCalledTimes(2)
            expect(mockGetColumnsConfig).toHaveBeenLastCalledWith(mockTranslation2 as any)
        })
    })

    describe("integration", () => {
        it("should handle complete workflow: sort, fetch more, navigate", async () => {
            const mockFetchMore = jest.fn().mockImplementation(() => Promise.resolve()) as jest.Mock
            const account = createMockDepositAccount({ publicId: "workflow-test" })
            const paginatedData = createMockPaginatedData([account])
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
                {
                    paginatedData,
                    fetchMore: mockFetchMore,
                },
            )

            act(() => {
                result.current.handleSort("email", "ASC")
            })

            await act(async () => {
                await result.current.fetchMoreAccounts("next-cursor")
            })

            const route = result.current.navigateToAccountDetails(account)

            expect(mockUseDepositAccountsFn).toHaveBeenLastCalledWith({
                first: 10,
                sort: {
                    by: CustomersSortBy.Email,
                    direction: SortDirection.Asc,
                },
            })
            expect(mockFetchMore).toHaveBeenCalledWith({
                variables: { after: "next-cursor" },
            })
            expect(route).toBe("/deposit-accounts/workflow-test")
        })

        it("should maintain state across multiple operations", async () => {
            const { result } = await setupHookSync(
                mockUseTranslations,
                mockGetColumnsConfig,
                mockUseDepositAccountsFn,
            )

            act(() => {
                result.current.handleSort("email", "ASC")
            })

            act(() => {
                result.current.handleSort("email", "DESC")
            })

            const account = createMockDepositAccount()
            const route = result.current.navigateToAccountDetails(account)

            expect(mockUseDepositAccountsFn).toHaveBeenLastCalledWith({
                first: 10,
                sort: {
                    by: CustomersSortBy.Email,
                    direction: SortDirection.Desc,
                },
            })
            expect(route).toBe("/deposit-accounts/public-123")
        })
    })
})

