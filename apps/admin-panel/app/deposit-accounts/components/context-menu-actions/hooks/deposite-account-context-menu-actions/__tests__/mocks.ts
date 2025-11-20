import { jest } from "@jest/globals"

// eslint-disable-next-line import/no-unassigned-import
import "../../../shared/test-utils/mocks"

jest.mock("@/components/context-menu-actions/hooks/setup-context-menu-actions/use-setup-context-menu-actions", () => ({
  useSetupContextMenuActions: jest.fn(),
}))

jest.mock("../../../deposit-account-context-menu/deposite-account-context-menu-items-config", () => ({
  getContextMenuItemsConfig: jest.fn(),
}))

export const getMockUseSetupContextMenuActions = () => {
  const mockedModule = jest.requireMock("@/components/context-menu-actions/hooks/setup-context-menu-actions/use-setup-context-menu-actions") as {
    useSetupContextMenuActions: jest.MockedFunction<any>
  }
  return mockedModule.useSetupContextMenuActions
}

export { getMockUseContextMenuData } from "../../../shared/test-utils/mocks"

export const getMockGetContextMenuItemsConfig = () => {
  const mockedModule = jest.requireMock("../../../deposit-account-context-menu/deposite-account-context-menu-items-config") as {
    getContextMenuItemsConfig: jest.MockedFunction<any>
  }
  return mockedModule.getContextMenuItemsConfig
}

