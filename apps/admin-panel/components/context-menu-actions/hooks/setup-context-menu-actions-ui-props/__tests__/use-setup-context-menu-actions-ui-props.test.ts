import { expect, it, describe, beforeEach } from "@jest/globals"
import { renderHook } from "@testing-library/react"

import { mockSetButtonProps } from "./mocks"

import type { ContextMenuButtonProps } from "../../../store/context-menu-actions-store"

// eslint-disable-next-line import/no-unassigned-import
import "./mocks"

import { useSetupContextMenuActionsUIProps } from "../use-setup-context-menu-actions-ui-props"

describe("useSetupContextMenuActionsUIProps", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call setButtonProps with provided props when component mounts and updates", () => {
    const mockProps: ContextMenuButtonProps = {
      buttonLabel: "Create",
      actions: [],
      disabled: false,
    }

    renderHook(() => useSetupContextMenuActionsUIProps(mockProps))

    expect(mockSetButtonProps).toHaveBeenCalledWith(mockProps)
  })

  it("should call setButtonProps with null when props is null", () => {
    renderHook(() => useSetupContextMenuActionsUIProps(null))

    expect(mockSetButtonProps).toHaveBeenCalledWith(null)
  })

  it("should update setButtonProps when props change", () => {
    const initialProps: ContextMenuButtonProps = {
      buttonLabel: "Create",
      actions: [],
    }
    const updatedProps: ContextMenuButtonProps = {
      buttonLabel: "Update",
      actions: [],
    }

    const { rerender } = renderHook(
      ({ props }) => useSetupContextMenuActionsUIProps(props),
      { initialProps: { props: initialProps } }
    )

    expect(mockSetButtonProps).toHaveBeenCalledWith(initialProps)

    rerender({ props: updatedProps })

    expect(mockSetButtonProps).toHaveBeenCalledWith(updatedProps)
  })
})

