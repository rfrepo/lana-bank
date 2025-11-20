import { jest } from "@jest/globals"

import { useCreateDepositDialog } from "../hooks/create-deposit-dialog/use-create-deposit-dialog"
import { useCreateDeposit } from "../hooks/create-deposit/use-create-deposit"

const mockSetAmount = jest.fn()
const mockSetReference = jest.fn()
const mockHandleSubmit = jest.fn(async (e: React.FormEvent) => {
  e.preventDefault()
})
const mockReset = jest.fn()
const mockClearAction = jest.fn()

const mockUseCreateDepositDialogReturn = {
  open: true,
  depositAccountId: "account-1",
  customerEmail: "test@example.com",
  clearAction: mockClearAction,
}

const mockUseCreateDepositReturn = {
  amount: "",
  reference: "",
  error: "",
  loading: false,
  setAmount: mockSetAmount,
  setReference: mockSetReference,
  handleSubmit: mockHandleSubmit,
  reset: mockReset,
}

jest.mock("../hooks/create-deposit-dialog/use-create-deposit-dialog", () => ({
  useCreateDepositDialog: jest.fn(),
}))

jest.mock("../hooks/create-deposit/use-create-deposit", () => ({
  useCreateDeposit: jest.fn(),
}))

export const getMockUseCreateDepositDialog = () => {
  const mockedModule = jest.requireMock("../hooks/create-deposit-dialog/use-create-deposit-dialog") as {
    useCreateDepositDialog: jest.MockedFunction<typeof useCreateDepositDialog>
  }
  return mockedModule.useCreateDepositDialog
}

export const getMockUseCreateDeposit = () => {
  const mockedModule = jest.requireMock("../hooks/create-deposit/use-create-deposit") as {
    useCreateDeposit: jest.MockedFunction<typeof useCreateDeposit>
  }
  return mockedModule.useCreateDeposit
}

export {
  mockSetAmount,
  mockSetReference,
  mockHandleSubmit,
  mockReset,
  mockClearAction,
  mockUseCreateDepositDialogReturn,
  mockUseCreateDepositReturn,
}

