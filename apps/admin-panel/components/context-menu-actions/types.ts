import type { ContextMenuAllowedPath } from "./utils/context-menu-utils"

export type ContextMenuItemConfig<
    TContext = unknown,
    TActionId extends string = string,
> = {
    id: TActionId
    labelKey: string
    dataTestId: string
    disabledMessageKey?: string | null
    allowedPaths: ContextMenuAllowedPath[]
    isDisabled?: (context: TContext) => boolean
}
