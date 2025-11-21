"use client"

import { useState } from "react"
import { HiPlus } from "react-icons/hi"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@lana/web/ui/tooltip"
import { Button } from "@lana/web/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@lana/web/ui/dropdown-menu"
import type { CreateAction } from "./types"

type CreateActionsButtonProps = {
    /** Available actions to show */
    actions: CreateAction[]
    /** Whether the button itself is disabled */
    disabled?: boolean
    /** Message to show when button is disabled */
    disabledMessage?: string
    /** Translation function for button label */
    buttonLabel: string
    /** Test identifier for the button */
    dataTestId?: string
}

/**
 * Dumb button component for create actions
 * Handles single vs multiple actions (auto-open vs dropdown)
 * No context, no state management - just receives props
 */
export function CreateActionsButton({
    actions,
    disabled = false,
    disabledMessage,
    buttonLabel,
    dataTestId = "global-create-button",
}: CreateActionsButtonProps) {
    const [showMenu, setShowMenu] = useState(false)

    // Don't show button if no actions available
    if (actions.length === 0) {
        return null
    }

    // Single action - execute directly on button click
    if (actions.length === 1) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            data-testid={dataTestId}
                            disabled={disabled || actions[0].isDisabled}
                            onClick={actions[0].onClick}
                        >
                            <HiPlus className="h-4 w-4" />
                            {buttonLabel}
                        </Button>
                    </TooltipTrigger>
                    {disabled && disabledMessage && (
                        <TooltipContent>
                            <p>{disabledMessage}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        )
    }

    // Multiple actions - show dropdown menu
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DropdownMenu
                            open={showMenu && !disabled}
                            onOpenChange={(open) => {
                                if (open && !disabled) {
                                    setShowMenu(true)
                                } else {
                                    setShowMenu(false)
                                }
                            }}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    data-testid={dataTestId}
                                    disabled={disabled}
                                    tabIndex={-1}
                                >
                                    <HiPlus className="h-4 w-4" />
                                    {buttonLabel}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                {actions.map((action) => (
                                    <DropdownMenuItem
                                        key={action.id}
                                        data-testid={action.dataTestId}
                                        onClick={action.onClick}
                                        disabled={action.isDisabled}
                                        className="cursor-pointer"
                                    >
                                        {action.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TooltipTrigger>
                {disabled && disabledMessage && (
                    <TooltipContent>
                        <p>{disabledMessage}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    )
}

