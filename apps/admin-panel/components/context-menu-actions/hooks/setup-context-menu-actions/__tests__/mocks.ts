import { jest } from "@jest/globals"

import { useSetContextMenuSelectedAction } from "../../../store/context-menu-actions-store"
import { useCreateContextMenuItemsFromConfigs } from "../../create-context-menu-items-from-configs/use-create-context-menu-items-from-configs"
import { useShouldShowContextMenu } from "../../should-show-context-menu/use-should-show-context-menu"
import { useSetupContextMenuActionsUIProps } from "../../setup-context-menu-actions-ui-props/use-setup-context-menu-actions-ui-props"

const mockSetSelectedAction = jest.fn()

jest.mock("../../../store/context-menu-actions-store", () => ({
  useSetContextMenuSelectedAction: jest.fn(() => mockSetSelectedAction),
}))

jest.mock("../../create-context-menu-items-from-configs/use-create-context-menu-items-from-configs", () => ({
  useCreateContextMenuItemsFromConfigs: jest.fn(),
}))

jest.mock("../../should-show-context-menu/use-should-show-context-menu", () => ({
  useShouldShowContextMenu: jest.fn(),
}))

jest.mock("../../setup-context-menu-actions-ui-props/use-setup-context-menu-actions-ui-props", () => ({
  useSetupContextMenuActionsUIProps: jest.fn(),
}))

export const getMockUseSetContextMenuSelectedAction = () => {
  const mockedModule = jest.requireMock("../../../store/context-menu-actions-store") as {
    useSetContextMenuSelectedAction: jest.MockedFunction<typeof useSetContextMenuSelectedAction>
  }
  return mockedModule.useSetContextMenuSelectedAction
}

export const getMockUseCreateContextMenuItemsFromConfigs = () => {
  const mockedModule = jest.requireMock("../../create-context-menu-items-from-configs/use-create-context-menu-items-from-configs") as {
    useCreateContextMenuItemsFromConfigs: jest.MockedFunction<typeof useCreateContextMenuItemsFromConfigs>
  }
  return mockedModule.useCreateContextMenuItemsFromConfigs
}

export const getMockUseShouldShowContextMenu = () => {
  const mockedModule = jest.requireMock("../../should-show-context-menu/use-should-show-context-menu") as {
    useShouldShowContextMenu: jest.MockedFunction<typeof useShouldShowContextMenu>
  }
  return mockedModule.useShouldShowContextMenu
}

export const getMockUseSetupContextMenuActionsUIProps = () => {
  const mockedModule = jest.requireMock("../../setup-context-menu-actions-ui-props/use-setup-context-menu-actions-ui-props") as {
    useSetupContextMenuActionsUIProps: jest.MockedFunction<typeof useSetupContextMenuActionsUIProps>
  }
  return mockedModule.useSetupContextMenuActionsUIProps
}

export { mockSetSelectedAction }

