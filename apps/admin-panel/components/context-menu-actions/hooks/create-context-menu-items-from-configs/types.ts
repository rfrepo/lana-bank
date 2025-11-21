import type { CreateAction } from "@lana/web/components/create-actions"

import type { ContextMenuItemConfig } from "../../types"

export type ContextMenuActionConfig<
    TContext = unknown,
    TActionId extends string = string,
> = ContextMenuItemConfig<TContext, TActionId>

export type UseCreateContextMenuItemsFromConfigsOptions<
    TActionId extends string = string,
    TEvent = { actionId: TActionId },
> = {
    translationNamespace?: string
    disabledMessageNamespace?: string
    pathname?: string
    createEvent?: (actionId: TActionId) => TEvent
}

export type UseCreateContextMenuItemsFromConfigsParams<
    TContext = unknown,
    TActionId extends string = string,
    TEvent = { actionId: TActionId; payload?: unknown },
> = {
    configs: ContextMenuActionConfig<TContext, TActionId>[]
    contextData: TContext | null
    onActionEvent?: (event: TEvent) => void
    options?: UseCreateContextMenuItemsFromConfigsOptions<TActionId, TEvent>
}

export type UseCreateContextMenuItemsFromConfigsReturn<
    TActionId extends string = string,
> = {
    actions: CreateAction[]
    buttonDisabled?: boolean
    buttonDisabledMessage?: string
    handleActionClick: (actionId: TActionId) => void
}

