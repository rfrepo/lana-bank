import React from "react"
import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import { fireEvent, render, waitFor } from "@testing-library/react"


import {
  getMockUseCreateDepositDialog,
  getMockUseCreateDeposit,
  mockUseCreateDepositDialogReturn,
  mockUseCreateDepositReturn,
  mockClearAction,
  mockReset,
  mockHandleSubmit,
} from "./mocks"

import { mockUseTranslations } from "@/jest.setup"

// eslint-disable-next-line import/order
import { CreateDepositDialog } from "../create-deposit-dialog"

describe("CreateDepositDialog", () => {
  type RenderOptions = {
    dialogOverrides?: Partial<typeof mockUseCreateDepositDialogReturn>
    depositOverrides?: Partial<typeof mockUseCreateDepositReturn>
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderCreateDepositDialog = async (options: RenderOptions = {}) => {
    const { dialogOverrides, depositOverrides } = options
    const mockUseCreateDepositDialog = getMockUseCreateDepositDialog()
    const mockUseCreateDeposit = getMockUseCreateDeposit()

    mockUseCreateDepositDialog.mockReturnValue({
      ...mockUseCreateDepositDialogReturn,
      ...dialogOverrides,
    })

    mockUseCreateDeposit.mockReturnValue({
      ...mockUseCreateDepositReturn,
      ...depositOverrides,
    } as typeof mockUseCreateDepositReturn)

    const utils = render(<CreateDepositDialog />)

    await waitFor(() => {
      expect(utils.container).toBeDefined()
    })

    return {
      ...utils,
      mockUseCreateDeposit,
      mockUseCreateDepositDialog,
    }
  }

  it("renders dialog content when open and depositAccountId exist", async () => {
    const { getByRole, getByText, getByLabelText, debug } = await renderCreateDepositDialog({ dialogOverrides: { open: true, depositAccountId: "123" } })

    expect(getByText(/t-title/)).toBeDefined()
    expect(getByText(/t-description/)).toBeDefined()
    expect(getByLabelText(/t-amount/)).toBeDefined()
    expect(getByLabelText(/t-reference/)).toBeDefined()
    expect(getByRole("button", { name: /t-(submit|submitting)/ })).toBeDefined()
  })

  type VisibilityScenario = {
    scenario: string
    dialogOverrides: Partial<typeof mockUseCreateDepositDialogReturn>
  }

  it.each<VisibilityScenario>([
    {
      scenario: "dialog closed",
      dialogOverrides: { open: false },
    },
    {
      scenario: "missing deposit account id",
      dialogOverrides: { depositAccountId: "" },
    },
  ])("does not render dialog when $scenario", async ({ dialogOverrides }) => {
    const { queryByRole } = await renderCreateDepositDialog({ dialogOverrides })
    expect(queryByRole("dialog")).toBeNull()
  })

  it("renders customer email banner when email exists", async () => {
    const customerEmail = "customer@example.com"
    const { getByText } = await renderCreateDepositDialog({
      dialogOverrides: { customerEmail },
    })

    expect(getByText(/t-creatingFor/)).toBeDefined()

    const { mock } = mockUseTranslations
    const { results } = mock
    const lastCallIndex = results.length - 1
    const mockTranslationFn = results[lastCallIndex]?.value as jest.Mock

    expect(mockTranslationFn).toHaveBeenCalledWith("creatingFor", { email: customerEmail })
  })

  it("displays hook error message", async () => {
    const errorMessage = "Test error message"
    const { getByText } = await renderCreateDepositDialog({
      depositOverrides: { error: errorMessage },
    })

    expect(getByText(errorMessage)).toBeDefined()
  })

  it("disables submit button when loading", async () => {
    const { getByRole } = await renderCreateDepositDialog({
      depositOverrides: { loading: true },
    })

    const submitButton = getByRole("button", { name: /t-submit/ })
    expect((submitButton as HTMLButtonElement).disabled).toBeTruthy()
  })

  it("invokes handleSubmit when the form is submitted", async () => {
    const { getByTestId } = await renderCreateDepositDialog()
    const form = getByTestId("deposit-form")

    fireEvent.submit(form as HTMLFormElement)

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled()
    })
  })

  it("clears dialog state when mutation succeeds", async () => {
    const { mockUseCreateDeposit } = await renderCreateDepositDialog()

    const onSuccess = mockUseCreateDeposit.mock.calls[0][0].onSuccess

    onSuccess?.()

    expect(mockClearAction).toHaveBeenCalledTimes(1)
    expect(mockReset).toHaveBeenCalledTimes(1)
  })
})
