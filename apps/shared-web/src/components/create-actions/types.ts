import { StoreApi } from "zustand/vanilla"

export type CreateActionId = string

export type CreateAction = {
    id: CreateActionId
    label: string
    isDisabled: boolean
    disabledMessage?: string
    onClick: () => void
    dataTestId: string
}

export type SelectedAction<TActionId extends string = string, TPayload = unknown> = {
    actionId: TActionId | null
    payload: TPayload | null
}

export type CreateActionsStore<
    TContext = unknown,
    TActionId extends string = string,
    TPayload = unknown
> = {
    context: TContext | null
    selectedAction: SelectedAction<TActionId, TPayload> | null
    updateMethods: {
        setContext: (context: TContext | null) => void
        setSelectedAction: (actionId: TActionId | null, payload?: TPayload) => void
        clearSelectedAction: () => void
    }
}

export type CreateActionsStoreInstance<
    TContext = unknown,
    TActionId extends string = string,
    TPayload = unknown
> = StoreApi<CreateActionsStore<TContext, TActionId, TPayload>>