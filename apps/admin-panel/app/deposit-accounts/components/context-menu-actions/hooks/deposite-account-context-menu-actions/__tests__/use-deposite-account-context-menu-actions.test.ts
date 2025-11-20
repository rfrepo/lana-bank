import { expect, it, describe, beforeEach,jest } from "@jest/globals"
import { renderHook } from "@testing-library/react"

import { createMockDepositAccountData } from "./helpers"
import {
  getMockUseSetupContextMenuActions,
  getMockUseContextMenuData,
  getMockGetContextMenuItemsConfig,
} from "./mocks"

import { mockUseTranslations } from "@/jest.setup"

// eslint-disable-next-line import/no-unassigned-import
import "./mocks"

import useDepositAccountContextMenuActions from "../use-deposite-account-context-menu-actions"

describe("useDepositAccountContextMenuActions", () => {
  const mockUseSetupContextMenuActions = getMockUseSetupContextMenuActions()
  const mockUseContextMenuData = getMockUseContextMenuData()
  const mockGetContextMenuItemsConfig = getMockGetContextMenuItemsConfig()

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetContextMenuItemsConfig.mockReturnValue([])
    mockUseContextMenuData.mockReturnValue(null)
    const mockT = jest.fn((key: string) => `CreateButton.buttons.${key}`)
    mockUseTranslations.mockReturnValue(mockT as any)
  })

  it("should get configs, context data, button label and call useSetupContextMenuActions", () => {
    const mockConfigs = [
      {
        id: "create-deposit" as const,
        labelKey: "deposit",
        dataTestId: "create-deposit-button",
        allowedPaths: [/^\/deposit-accounts\/[^/]+/],
      },
    ]
    const mockContextData = createMockDepositAccountData()
    const mockButtonLabel = "CreateButton.buttons.create"

    mockGetContextMenuItemsConfig.mockReturnValue(mockConfigs)
    mockUseContextMenuData.mockReturnValue(mockContextData)
    const mockT = jest.fn(() => mockButtonLabel)
    mockUseTranslations.mockReturnValue(mockT as any)

    renderHook(() => useDepositAccountContextMenuActions())

    expect(mockGetContextMenuItemsConfig).toHaveBeenCalled()
    expect(mockUseContextMenuData).toHaveBeenCalled()
    expect(mockUseSetupContextMenuActions).toHaveBeenCalledWith({
      configs: mockConfigs,
      contextData: mockContextData,
      buttonLabel: mockButtonLabel,
    })
  })

  it("should call useTranslations with correct namespace and key", () => {
    renderHook(() => useDepositAccountContextMenuActions())

    expect(mockUseTranslations).toHaveBeenCalledWith("CreateButton.buttons")
    const { mock } = mockUseTranslations
    const { results } = mock
    const lastCallIndex = results.length - 1
    const mockTranslationFn = results[lastCallIndex]?.value as jest.Mock
    expect(mockTranslationFn).toHaveBeenCalledWith("create")
  })
})

