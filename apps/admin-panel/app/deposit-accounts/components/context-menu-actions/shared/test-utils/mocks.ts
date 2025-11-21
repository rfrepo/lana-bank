import { jest } from "@jest/globals"

import {
  useContextMenuData,
  useContextMenuSelectedAction,
} from "@/components/context-menu-actions/store/context-menu-actions-store"

const mockClearAction = jest.fn()

jest.mock("@/components/context-menu-actions/store/context-menu-actions-store", () => ({
  useContextMenuData: jest.fn(),
  useContextMenuSelectedAction: jest.fn(),
  useClearContextMenuSelectedAction: jest.fn(() => mockClearAction),
}))

export const getMockUseContextMenuData = () => {
  const mockedModule = jest.requireMock("@/components/context-menu-actions/store/context-menu-actions-store") as {
    useContextMenuData: jest.MockedFunction<typeof useContextMenuData>
  }
  return mockedModule.useContextMenuData
}

export const getMockUseContextMenuSelectedAction = () => {
  const mockedModule = jest.requireMock("@/components/context-menu-actions/store/context-menu-actions-store") as {
    useContextMenuSelectedAction: jest.MockedFunction<typeof useContextMenuSelectedAction>
  }
  return mockedModule.useContextMenuSelectedAction
}

export { mockClearAction }

