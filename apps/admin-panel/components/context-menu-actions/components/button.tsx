"use client"

import { CreateActionsButton } from "@lana/web/components/create-actions"

import {
    useContextMenuButtonProps,
    useContextMenuShouldRender,
} from "../store/context-menu-actions-store"

import CreateButton from "@/app/create"

const ContextMenuCreateActionsButton = () => {
    const buttonProps = useContextMenuButtonProps()
    const shouldRender = useContextMenuShouldRender()

    if (!shouldRender || !buttonProps) {
        return <CreateButton />
    }

    return (
        <CreateActionsButton
            actions={buttonProps.actions}
            buttonLabel={buttonProps.buttonLabel}
            disabled={buttonProps.disabled}
            disabledMessage={buttonProps.disabledMessage}
        />
    )
}

export default ContextMenuCreateActionsButton

