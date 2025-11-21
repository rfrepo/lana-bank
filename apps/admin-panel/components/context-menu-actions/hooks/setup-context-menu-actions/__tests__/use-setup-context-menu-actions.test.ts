import { expect, it, describe, beforeEach, jest } from "@jest/globals"
import { renderHook } from "@testing-library/react"

import {
    getMockUseCreateContextMenuItemsFromConfigs,
    getMockUseShouldShowContextMenu,
    getMockUseSetupContextMenuActionsUIProps,
    mockSetSelectedAction,
} from "./mocks"

import type { ContextMenuItemConfig } from "../../../types"

// eslint-disable-next-line import/no-unassigned-import
import "./mocks"

import { useSetupContextMenuActions } from "../use-setup-context-menu-actions"

describe("useSetupContextMenuActions", () => {
    const mockUseCreateContextMenuItemsFromConfigs = getMockUseCreateContextMenuItemsFromConfigs()
    const mockUseShouldShowContextMenu = getMockUseShouldShowContextMenu()
    const mockUseSetupContextMenuActionsUIProps = getMockUseSetupContextMenuActionsUIProps()
    const mockOnActionEvent = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseCreateContextMenuItemsFromConfigs.mockReset()
        mockUseShouldShowContextMenu.mockReset()
        mockUseSetupContextMenuActionsUIProps.mockReset()

        mockUseCreateContextMenuItemsFromConfigs.mockReturnValue({
            actions: [],
            buttonDisabled: false,
            buttonDisabledMessage: undefined,
            handleActionClick: jest.fn(),
        })
        mockUseShouldShowContextMenu.mockReturnValue(true)
    })

    it("should setup context menu actions with button props when shouldShow is true and actions exist", () => {
        const mockConfigs: ContextMenuItemConfig<unknown, string>[] = [
            {
                id: "action-1",
                labelKey: "label1",
                dataTestId: "test-1",
                allowedPaths: [/^\/test/],
            },
        ]
        const mockActions = [
            {
                id: "action-1",
                label: "Action 1",
                isDisabled: false,
                onClick: jest.fn(),
                dataTestId: "test-1",
            },
        ]

        mockUseCreateContextMenuItemsFromConfigs.mockReturnValue({
            actions: mockActions,
            buttonDisabled: false,
            buttonDisabledMessage: undefined,
            handleActionClick: jest.fn(),
        })

        renderHook(() =>
            useSetupContextMenuActions({
                configs: mockConfigs,
                contextData: null,
                buttonLabel: "Create",
            })
        )

        expect(mockUseCreateContextMenuItemsFromConfigs).toHaveBeenCalled()
        expect(mockUseShouldShowContextMenu).toHaveBeenCalled()
        expect(mockUseSetupContextMenuActionsUIProps).toHaveBeenCalled()
    })

    it("should setup context menu actions with null button props when shouldShow is false", () => {
        mockUseShouldShowContextMenu.mockReturnValue(false)

        renderHook(() =>
            useSetupContextMenuActions({
                configs: [],
                contextData: null,
                buttonLabel: "Create",
            })
        )

        expect(mockUseSetupContextMenuActionsUIProps).toHaveBeenCalled()
    })

    it("should setup context menu actions with null button props when actions are empty", () => {
        mockUseCreateContextMenuItemsFromConfigs.mockReturnValue({
            actions: [],
            buttonDisabled: false,
            buttonDisabledMessage: undefined,
            handleActionClick: jest.fn(),
        })

        renderHook(() =>
            useSetupContextMenuActions({
                configs: [],
                contextData: null,
                buttonLabel: "Create",
            })
        )

        expect(mockUseSetupContextMenuActionsUIProps).toHaveBeenCalled()
    })

    it("should call onActionEvent and update store when action event is triggered", () => {
        let capturedOnActionEvent: ((event: { actionId: string | null; payload?: unknown | null }) => void) | undefined

        mockUseCreateContextMenuItemsFromConfigs.mockImplementation((params: any) => {
            capturedOnActionEvent = params.onActionEvent
            return {
                actions: [],
                buttonDisabled: false,
                buttonDisabledMessage: undefined,
                handleActionClick: jest.fn(),
            }
        })

        renderHook(() =>
            useSetupContextMenuActions({
                configs: [],
                contextData: null,
                buttonLabel: "Create",
                onActionEvent: mockOnActionEvent,
            })
        )

        expect(capturedOnActionEvent).toBeDefined()

        if (capturedOnActionEvent) {
            capturedOnActionEvent({ actionId: "test-action", payload: "test-payload" })

            expect(mockSetSelectedAction).toHaveBeenCalledWith({
                actionId: "test-action",
                payload: "test-payload",
            })
            expect(mockOnActionEvent).toHaveBeenCalledWith({
                actionId: "test-action",
                payload: "test-payload",
            })
        }
    })

    it("should handle action event with null values", () => {
        let capturedOnActionEvent: ((event: { actionId: string | null; payload?: unknown | null }) => void) | undefined

        mockUseCreateContextMenuItemsFromConfigs.mockImplementation((params: any) => {
            capturedOnActionEvent = params.onActionEvent
            return {
                actions: [],
                buttonDisabled: false,
                buttonDisabledMessage: undefined,
                handleActionClick: jest.fn(),
            }
        })

        renderHook(() =>
            useSetupContextMenuActions({
                configs: [],
                contextData: null,
                buttonLabel: "Create",
            })
        )

        if (capturedOnActionEvent) {
            capturedOnActionEvent({ actionId: null, payload: null })

            expect(mockSetSelectedAction).toHaveBeenCalledWith({
                actionId: null,
                payload: null,
            })
        }
    })
})

