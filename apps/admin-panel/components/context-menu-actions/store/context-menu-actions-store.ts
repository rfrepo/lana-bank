import { create } from "zustand"
import type { SelectedAction, CreateAction } from "@lana/web/components/create-actions/types"

export type ContextMenuButtonProps = {
    buttonLabel: string
    disabled?: boolean
    actions: CreateAction[]
    disabledMessage?: string
}

const INITIAL_BUTTON_PROPS: ContextMenuButtonProps | null = null

type ContextMenuStore<TData = unknown> = {
    data: TData | null
    clearButtonProps: () => void
    clearSelectedAction: () => void
    selectedAction: SelectedAction | null
    setData: (data: TData | null) => void
    buttonProps: ContextMenuButtonProps | null
    setSelectedAction: (e: SelectedAction) => void
    setButtonProps: (props: ContextMenuButtonProps | null) => void
}

const useContextMenuStore = create<
    ContextMenuStore<unknown>
>()((set) => ({
    data: null,
    selectedAction: null,
    buttonProps: INITIAL_BUTTON_PROPS,
    setData: (data) => set({ data }),
    setSelectedAction: ({ actionId, payload }: SelectedAction) =>
        set({
            selectedAction: {
                actionId,
                payload: payload || null,
            },
        }),
    clearSelectedAction: () => set({ selectedAction: null }),
    setButtonProps: (props) => set({ buttonProps: props }),
    clearButtonProps: () => set({ buttonProps: INITIAL_BUTTON_PROPS }),
}))

export const INITIAL_STATE = {
    data: null,
    selectedAction: null,
    buttonProps: INITIAL_BUTTON_PROPS,
} as const

export const useContextMenuData = <TData = unknown>() =>
    useContextMenuStore((state) => state.data as TData | null)

export const useSetContextMenuData = <TData = unknown>() =>
    useContextMenuStore((state) => state.setData) as (data: TData | null) => void

export const useContextMenuSelectedAction = <
    TActionId extends string = string,
    TPayload = unknown
>() =>
    useContextMenuStore((state) => state.selectedAction) as SelectedAction<TActionId, TPayload> | null

export const useSetContextMenuSelectedAction = <
    TActionId extends string = string,
    TPayload = unknown
>() =>
    useContextMenuStore((state) => state.setSelectedAction) as (selectedAction: SelectedAction<TActionId, TPayload>) => void

export const useClearContextMenuSelectedAction = () => useContextMenuStore((state) => state.clearSelectedAction) as () => void

export const useContextMenuButtonProps = () =>
    useContextMenuStore((state) => state.buttonProps)

export const useSetContextMenuButtonProps = () =>
    useContextMenuStore((state) => state.setButtonProps)

export const useContextMenuShouldRender = () =>
    useContextMenuStore((state) => (state.buttonProps?.actions.length ?? 0) > 0)

export const useClearContextMenuButtonProps = () =>
    useContextMenuStore((state) => state.clearButtonProps)

