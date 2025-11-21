import { expect, it, describe, beforeEach, jest, afterEach } from "@jest/globals"
import { waitFor } from "@testing-library/react"
import { act } from 'react'

import { GetCustomerBasicDetailsDocument } from "@/lib/graphql/generated"
import { mockUseTranslations } from "@/jest.setup"

// eslint-disable-next-line import/no-unassigned-import, no-duplicate-imports
import "./mocks"
import {
  getMockUseApolloClient,
  getMockUseCreateDepositMutation,
  getMockToast,
  getMockCurrencyConverter,
  mockRouter,
} from "./mocks"
import {
  setupHook,
  createMockDepositData,
  submitForm,
} from "./helpers"

const mockCreateDeposit = jest.fn()
const mockResetMutation = jest.fn()
const mockQuery = jest.fn()

describe("useCreateDeposit", () => {
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>

  let mockUseApolloClient: ReturnType<typeof getMockUseApolloClient>
  let mockUseCreateDepositMutation: ReturnType<typeof getMockUseCreateDepositMutation>
  let mockToast: ReturnType<typeof getMockToast>
  let mockCurrencyConverter: ReturnType<typeof getMockCurrencyConverter>

  const mockClient = {
    query: mockQuery,
    modify: jest.fn(),
    gc: jest.fn(),
  }

  beforeEach(() => {
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });

    mockCreateDeposit.mockReset()
    mockResetMutation.mockReset()
    mockQuery.mockReset()

    mockUseApolloClient = getMockUseApolloClient()
    mockUseCreateDepositMutation = getMockUseCreateDepositMutation()
    mockToast = getMockToast()
    mockCurrencyConverter = getMockCurrencyConverter()

    mockUseApolloClient.mockReturnValue(mockClient as any)
    mockUseCreateDepositMutation.mockReturnValue([
      mockCreateDeposit,
      { loading: false, error: null, reset: mockResetMutation },
    ] as any)

    mockCurrencyConverter.usdToCents.mockReset()
    mockCurrencyConverter.usdToCents.mockImplementation((value: number) => {
      if (isNaN(value)) {
        return 0 as any
      }
      return Math.round(value * 100) as any
    })

    mockUseTranslations.mockReturnValue(jest.fn((key: string) => `Deposits.CreateDepositDialog.${key}`))
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it("should initialize with empty state", async () => {
    const { result } = await setupHook({
      depositAccountId: "account-1",
    })

    expect(result.current.amount).toBe("")
    expect(result.current.reference).toBe("")
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it("should update amount when setAmount is called", async () => {
    const { result } = await setupHook({
      depositAccountId: "account-1",
    })

    act(() => {
      result.current.setAmount("100.50")
    })

    await waitFor(() => {
      expect(result.current.amount).toBe("100.50")
    })
  })

  it("should update reference when setReference is called", async () => {
    const { result } = await setupHook({
      depositAccountId: "account-1",
    })

    act(() => {
      result.current.setReference("test-reference")
    })

    await waitFor(() => {
      expect(result.current.reference).toBe("test-reference")
    })
  })

  it("should reset form state when reset is called", async () => {
    const { result } = await setupHook({
      depositAccountId: "account-1",
    })

    act(() => {
      result.current.setAmount("100")
      result.current.setReference("ref")
    })

    await waitFor(() => {
      expect(result.current.amount).toBe("100")
    })

    act(() => {
      result.current.reset()
    })

    await waitFor(() => {
      expect(result.current.amount).toBe("")
      expect(result.current.reference).toBe("")
      expect(result.current.error).toBeNull()
      expect(mockResetMutation).toHaveBeenCalled()
    })
  })

  it("should create deposit successfully and call onSuccess", async () => {
    const mockOnSuccess = jest.fn()
    const mockDepositData = createMockDepositData()

    mockCreateDeposit.mockResolvedValue({ data: mockDepositData } as any)
    mockQuery.mockResolvedValue({} as any)

    const { result } = await setupHook({
      depositAccountId: "account-1",
      onSuccess: mockOnSuccess,
    })

    act(() => {
      result.current.setAmount("100")
      result.current.setReference("test-ref")
    })

    await waitFor(() => {
      expect(result.current.amount).toBe("100")
      expect(result.current.reference).toBe("test-ref")
    })

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as React.FormEvent<HTMLFormElement>)
    })

    await waitFor(() => {
      expect(mockCreateDeposit).toHaveBeenCalled()
      const callArgs = mockCreateDeposit.mock.calls[0][0] as {
        variables: {
          input: {
            depositAccountId: string
            reference: string
            amount: number
          }
        }
      }
      expect(callArgs.variables.input.depositAccountId).toBe("account-1")
      expect(callArgs.variables.input.reference).toBe("test-ref")
      expect(callArgs.variables.input.amount).toBe(10000)
      expect(mockCurrencyConverter.usdToCents).toHaveBeenCalledWith(100)
      expect(mockQuery).toHaveBeenCalledWith({
        query: GetCustomerBasicDetailsDocument,
        variables: {
          id: "customer-123",
        },
        fetchPolicy: "network-only",
      })
      expect(mockToast.success).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith("/deposits/deposit-123")
      expect(mockOnSuccess).toHaveBeenCalled()
      expect(result.current.error).toBeNull()
    })
  })

  it("should handle error when createDeposit fails", async () => {
    const mockError = new Error("Network error")
    mockCreateDeposit.mockRejectedValue(mockError as any)

    const hookResult = await setupHook({
      depositAccountId: "account-1",
    })

    await submitForm(hookResult, { amount: "100" })

    await waitFor(() => {
      expect(hookResult.result.current.error).toBe("Network error")
    })
  })

  it("should handle error when result.data is null", async () => {

    mockCreateDeposit.mockResolvedValue({ data: null } as any)

    const hookResult = await setupHook({
      depositAccountId: "account-1",
    })

    await submitForm(hookResult, { amount: "100" })

    await waitFor(() => {
      expect(hookResult.result.current.error).toBeTruthy()
    })
  })

  it("should clear error on new submit attempt", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });

    mockCreateDeposit.mockRejectedValueOnce(new Error("First error") as any)
    mockCreateDeposit.mockResolvedValueOnce({
      data: createMockDepositData(),
    } as any)
    mockQuery.mockResolvedValue({} as any)

    const hookResult = await setupHook({
      depositAccountId: "account-1",
    })

    await submitForm(hookResult, { amount: "100" })

    await waitFor(() => {
      expect(hookResult.result.current.error).toBeTruthy()
    })

    await submitForm(hookResult, { amount: "100" })

    await waitFor(() => {
      expect(hookResult.result.current.error).toBeNull()
    })

    consoleErrorSpy.mockRestore()
  })
})

