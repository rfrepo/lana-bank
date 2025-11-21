import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import type { CreateAction } from "@lana/web/components/create-actions"

import { isPathAllowed } from "../../utils/context-menu-utils"

import {
  UseCreateContextMenuItemsFromConfigsParams,
  UseCreateContextMenuItemsFromConfigsReturn,
} from "./types"

export const useCreateContextMenuItemsFromConfigs = <
  TContext = unknown,
  TActionId extends string = string,
  TEvent = { actionId: TActionId },
>(
  params: UseCreateContextMenuItemsFromConfigsParams<TContext, TActionId, TEvent>,
): UseCreateContextMenuItemsFromConfigsReturn => {
  const { configs, contextData, onActionEvent, options = {} } = params

  const routerPathname = usePathname()

  const {
    createEvent,
    pathname = routerPathname,
    translationNamespace = "CreateButton.menuItems",
    disabledMessageNamespace = "CreateButton.disabledMessages",
  } = options

  const t = useTranslations(translationNamespace)
  const tDisabled = useTranslations(disabledMessageNamespace)

  const handleActionClick = (actionId: string) => {
    const event = createEvent
      ? createEvent(actionId as TActionId)
      : ({ actionId } as TEvent)

    onActionEvent?.(event)
  }

  const availableConfigs = configs.filter((config) => {
    if (!contextData) return false
    return isPathAllowed(config.allowedPaths, pathname)
  })

  const actions: CreateAction[] = availableConfigs.map((config) => {
    const { id, labelKey, dataTestId, disabledMessageKey, isDisabled } = config

    const isActionDisabled = contextData
      ? isDisabled?.(contextData) ?? false
      : true

    const disabledMessage =
      isActionDisabled && disabledMessageKey
        ? tDisabled(disabledMessageKey)
        : undefined

    const createOnClickHandler = (actionId: TActionId) => () => {
      handleActionClick(actionId)
    }

    return {
      id,
      label: t(labelKey),
      isDisabled: isActionDisabled,
      disabledMessage,
      onClick: createOnClickHandler(id),
      dataTestId,
    }
  })

  const allActionsDisabled = actions.length > 0 && actions.every((action) => action.isDisabled)
  const firstDisabledAction = actions.find((action) => action.isDisabled)
  const buttonDisabled = allActionsDisabled
  const buttonDisabledMessage = allActionsDisabled && firstDisabledAction?.disabledMessage
    ? firstDisabledAction.disabledMessage
    : undefined

  return {
    actions,
    buttonDisabled,
    buttonDisabledMessage,
    handleActionClick,
  }
}

