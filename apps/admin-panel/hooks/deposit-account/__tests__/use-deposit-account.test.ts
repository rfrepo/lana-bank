import { getMockUseGetDepositAccountByPublicIdQuery } from './mocks'
import { expect, it, describe, beforeEach, jest } from "@jest/globals"
import { renderHook } from "@testing-library/react"

import { mockDepositAccount } from "../__fixtures__/mock-deposit-account"

import {
  Customer,
  DepositAccount,
  useGetDepositAccountByPublicIdQuery,
} from "@/lib/graphql/generated"

// eslint-disable-next-line import/order
import { useDepositAccount } from "../use-deposit-account"


const createMockReturnValue = (
  overrides?: Partial<
    ReturnType<typeof useGetDepositAccountByPublicIdQuery>
  >,
) => ({
  data: undefined,
  loading: false,
  error: undefined,
  ...overrides,
})

describe("useDepositAccount", () => {
  let mockUseGetDepositAccountByPublicIdQuery: ReturnType<typeof getMockUseGetDepositAccountByPublicIdQuery>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGetDepositAccountByPublicIdQuery = getMockUseGetDepositAccountByPublicIdQuery()
  })

  it("should call useGetDepositAccountByPublicIdQuery with correct parameters", () => {
    const publicId = "12345"
    mockUseGetDepositAccountByPublicIdQuery.mockReturnValue(
      createMockReturnValue(),
    )

    renderHook(() => useDepositAccount(publicId))

    expect(mockUseGetDepositAccountByPublicIdQuery).toHaveBeenCalledWith({
      variables: { publicId },
      skip: false,
      errorPolicy: "all",
    })
  })

  it("should skip query when publicId is empty string", () => {
    mockUseGetDepositAccountByPublicIdQuery.mockReturnValue(
      createMockReturnValue(),
    )

    renderHook(() => useDepositAccount(""))

    expect(mockUseGetDepositAccountByPublicIdQuery).toHaveBeenCalledWith({
      variables: { publicId: "" },
      skip: true,
      errorPolicy: "all",
    })
  })

  it("should set depositAccount when data.publicIdTarget is a DepositAccount", () => {
    const mockAccount = mockDepositAccount() as DepositAccount

    mockUseGetDepositAccountByPublicIdQuery.mockReturnValue(
      createMockReturnValue({
        data: {
          publicIdTarget: mockAccount,
        },
      }),
    )

    const { result } = renderHook(() => useDepositAccount("12345"))

    expect(result.current.depositAccount).toEqual(mockAccount)
  })

  it("should set depositAccount to null when data.publicIdTarget is not a DepositAccount", () => {
    const mockCustomer = {
      __typename: "Customer" as const,
      id: "customer-1",
      customerId: "uuid-customer-1",
      publicId: "12345",
    } as Customer

    mockUseGetDepositAccountByPublicIdQuery.mockReturnValue(
      createMockReturnValue({
        data: {
          publicIdTarget: mockCustomer,
        },
      }),
    )

    const { result } = renderHook(() => useDepositAccount("12345"))

    expect(result.current.depositAccount).toBeNull()
  })

  it("should set depositAccount to null when data.publicIdTarget is null", () => {
    mockUseGetDepositAccountByPublicIdQuery.mockReturnValue(
      createMockReturnValue({
        data: {
          publicIdTarget: null,
        },
      }),
    )

    const { result } = renderHook(() => useDepositAccount("12345"))

    expect(result.current.depositAccount).toBeNull()
  })

  it("should set depositAccount to null when data is undefined", () => {
    mockUseGetDepositAccountByPublicIdQuery.mockReturnValue(
      createMockReturnValue(),
    )

    const { result } = renderHook(() => useDepositAccount("12345"))

    expect(result.current.depositAccount).toBeNull()
  })
})

