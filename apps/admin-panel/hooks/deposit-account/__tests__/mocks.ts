import { jest } from "@jest/globals"

import { useGetDepositAccountByPublicIdQuery } from "@/lib/graphql/generated"

jest.mock("@/lib/graphql/generated", () => {
  const actual = jest.requireActual("@/lib/graphql/generated") as Record<string, unknown>
  return {
    ...actual,
    useGetDepositAccountByPublicIdQuery: jest.fn(() => ({
      data: undefined,
      loading: false,
      error: undefined,
    })),
  }
})

export const getMockUseGetDepositAccountByPublicIdQuery = () => {
  const mockedModule = jest.requireMock("@/lib/graphql/generated") as {
    useGetDepositAccountByPublicIdQuery: jest.MockedFunction<
      typeof useGetDepositAccountByPublicIdQuery
    >
  }
  return mockedModule.useGetDepositAccountByPublicIdQuery
}

