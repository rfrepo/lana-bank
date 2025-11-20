import { expect, it, describe, beforeEach, jest } from "@jest/globals"
import { renderHook } from "@testing-library/react"

import { DEPOSIT_ACCOUNT_ACTION_IDS } from "../../../../types"

import { createMockDepositAccountData } from "./helpers"
// eslint-disable-next-line import/no-unassigned-import
import "./mocks"
import {
  getMockUseContextMenuData,
  getMockUseContextMenuSelectedAction,
  mockClearAction,
} from "./mocks"

import { useCreateDepositDialog } from "../use-create-deposit-dialog"


describe("useCreateDepositDialog", () => {
  const mockUseContextMenuData = getMockUseContextMenuData()
  const mockUseContextMenuSelectedAction = getMockUseContextMenuSelectedAction()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseContextMenuSelectedAction.mockReturnValue(null)
    mockUseContextMenuData.mockReturnValue(null)
  })

  it("should return open false when selected action is not CREATE_DEPOSIT", () => {
    mockUseContextMenuSelectedAction.mockReturnValue({
      actionId: DEPOSIT_ACCOUNT_ACTION_IDS.CREATE_WITHDRAWAL,
      payload: null,
    })

    const { result } = renderHook(() => useCreateDepositDialog())

    expect(result.current.open).toBe(false)
    expect(result.current.depositAccountId).toBe("")
    expect(result.current.customerEmail).toBeUndefined()
    expect(result.current.clearAction).toBe(mockClearAction)
  })

  it("should return open true when selected action is CREATE_DEPOSIT", () => {
    const mockContextData = createMockDepositAccountData()
    mockUseContextMenuSelectedAction.mockReturnValue({
      actionId: DEPOSIT_ACCOUNT_ACTION_IDS.CREATE_DEPOSIT,
      payload: null,
    })
    mockUseContextMenuData.mockReturnValue(mockContextData)

    const { result } = renderHook(() => useCreateDepositDialog())

    expect(result.current.open).toBe(true)
    expect(result.current.depositAccountId).toBe(mockContextData.depositAccountId)
    expect(result.current.customerEmail).toBe(mockContextData.customer?.email)
    expect(result.current.clearAction).toBe(mockClearAction)
  })

  it("should return open false when selected action is null", () => {
    mockUseContextMenuSelectedAction.mockReturnValue(null)

    const { result } = renderHook(() => useCreateDepositDialog())

    expect(result.current.open).toBe(false)
  })

  it("should return empty depositAccountId when context data is null", () => {
    mockUseContextMenuSelectedAction.mockReturnValue({
      actionId: DEPOSIT_ACCOUNT_ACTION_IDS.CREATE_DEPOSIT,
      payload: null,
    })
    mockUseContextMenuData.mockReturnValue(null)

    const { result } = renderHook(() => useCreateDepositDialog())

    expect(result.current.depositAccountId).toBe("")
    expect(result.current.customerEmail).toBeUndefined()
  })
})

