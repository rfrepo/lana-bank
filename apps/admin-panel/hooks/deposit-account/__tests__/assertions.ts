import { renderHook } from "@testing-library/react"
import { mockDepositAccount } from "../__fixtures__/mock-deposit-account"

export type ResultType = ReturnType<typeof renderHook>["result"]

export const assertDepositAccountNull = ({
  current: { depositAccount },
}: ResultType) => {
  expect(depositAccount).toBeNull()
}

export const assertDepositAccountEquals = (
  { current: { depositAccount } }: ResultType,
  expectedAccount: ReturnType<typeof mockDepositAccount>,
) => {
  expect(depositAccount).toEqual(expectedAccount)
}

