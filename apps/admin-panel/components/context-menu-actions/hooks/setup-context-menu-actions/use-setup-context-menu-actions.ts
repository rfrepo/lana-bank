import { useMemo } from "react"

import type { SelectedAction } from "@lana/web/components/create-actions/types"

import {
  type ContextMenuButtonProps,
  useSetContextMenuSelectedAction,
} from "../../store/context-menu-actions-store"
import { ContextMenuItemConfig } from "../../types"

import { useCreateContextMenuItemsFromConfigs } from "../create-context-menu-items-from-configs/use-create-context-menu-items-from-configs"
import { useShouldShowContextMenu } from "../should-show-context-menu/use-should-show-context-menu"
import { useSetupContextMenuActionsUIProps } from "../setup-context-menu-actions-ui-props/use-setup-context-menu-actions-ui-props"

type SelectedActionCompatible<TActionId extends string = string> = {
    actionId: TActionId | null
    payload?: unknown | null
} | {
    actionId: TActionId
    payload?: unknown
}

type EventConstraint<TActionId extends string> = SelectedActionCompatible<TActionId>

export type UseSetupContextMenuActionsParams<
    TContext,
    TActionId extends string,
    TEvent extends EventConstraint<TActionId> = SelectedAction<TActionId>,
> = {
    contextData: TContext | null
    buttonLabel: string
    onActionEvent?: (event: TEvent) => void
    configs: ContextMenuItemConfig<TContext, TActionId>[]
}

export function useSetupContextMenuActions<
    TContext,
    TActionId extends string,
    TEvent extends EventConstraint<TActionId> = SelectedAction<TActionId>,
>(params: UseSetupContextMenuActionsParams<TContext, TActionId, TEvent>): void {
    const { buttonLabel, onActionEvent, ...restParams } = params
    const { configs } = restParams

    const updateStoreWithSelectedActionId = useSetContextMenuSelectedAction<TActionId>()

    const handleActionEvent = ({ actionId = null, payload = null }: TEvent) => {
        updateStoreWithSelectedActionId({
            actionId,
            payload,
        } as SelectedAction<TActionId>)
        onActionEvent?.({ actionId, payload } as TEvent)
    }

    const { actions, buttonDisabled, buttonDisabledMessage } =
        useCreateContextMenuItemsFromConfigs<TContext, TActionId, TEvent>({
            ...restParams,
            onActionEvent: handleActionEvent,
        })

    const shouldShow = useShouldShowContextMenu(configs)

    const buttonProps: ContextMenuButtonProps | null = useMemo(() =>
        (!shouldShow || actions.length === 0)
            ? null
            : {
                actions,
                buttonLabel,
                disabled: buttonDisabled,
                disabledMessage: buttonDisabledMessage,
            }
        , [shouldShow, actions, buttonLabel, buttonDisabled, buttonDisabledMessage])

    useSetupContextMenuActionsUIProps(buttonProps)
}

