import { jest } from "@jest/globals"

import { useSetContextMenuButtonProps } from "../../../store/context-menu-actions-store"

const mockSetButtonProps = jest.fn()

jest.mock("../../../store/context-menu-actions-store", () => ({
  useSetContextMenuButtonProps: jest.fn(() => mockSetButtonProps),
}))

export const getMockUseSetContextMenuButtonProps = () => {
  const mockedModule = jest.requireMock("../../../store/context-menu-actions-store") as {
    useSetContextMenuButtonProps: jest.MockedFunction<typeof useSetContextMenuButtonProps>
  }
  return mockedModule.useSetContextMenuButtonProps
}

export { mockSetButtonProps }

