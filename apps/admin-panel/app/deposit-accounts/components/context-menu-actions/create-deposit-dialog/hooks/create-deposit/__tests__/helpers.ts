import { jest } from "@jest/globals"
import { renderHook, RenderHookResult } from "@testing-library/react"
import React, { act } from "react"

import { createMockDepositAccountData } from "../../shared/test-utils/helpers"

type UseCreateDepositParams = {
  depositAccountId: string
  onSuccess?: () => void
}

type UseCreateDepositReturn = {
  amount: string
  reference: string
  error: string | null
  loading: boolean
  setAmount: (value: string) => void
  setReference: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
}

export { createMockDepositAccountData }

export const createMockDepositData = (overrides?: {
  publicId?: string
  customerId?: string
}) => ({
  depositRecord: {
    deposit: {
      publicId: overrides?.publicId ?? "deposit-123",
      account: {
        customer: {
          customerId: overrides?.customerId ?? "customer-123",
        },
      },
    },
  },
})

export const setupHook = async (
  params: UseCreateDepositParams,
): Promise<RenderHookResult<UseCreateDepositReturn, unknown>> => {
  const { useCreateDeposit } = await import("../use-create-deposit")
  return renderHook(() => useCreateDeposit(params))
}

export const submitForm = async (
  hookResult: { result: { current: UseCreateDepositReturn } },
  formData?: { amount?: string; reference?: string },
) => {
  if (formData?.amount) {
    act(() => {
      hookResult.result.current.setAmount(formData.amount!)
    })
  }
  if (formData?.reference) {
    act(() => {
      hookResult.result.current.setReference(formData.reference!)
    })
  }

  await act(async () => {
    await hookResult.result.current.handleSubmit({
      preventDefault: jest.fn(),
    } as React.FormEvent<HTMLFormElement>)
  })
}

