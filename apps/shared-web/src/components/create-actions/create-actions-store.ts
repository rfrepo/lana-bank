import { createStore, type StoreApi, type StateCreator } from "zustand/vanilla"
import { CreateActionsStoreInstance, CreateActionsStore } from "./types"

export const createInstanceOfCreateActionsStore = <
    TContext = unknown,
    TActionId extends string = string,
    TPayload = unknown
>(): CreateActionsStoreInstance<TContext, TActionId, TPayload> => {
    const stateCreator: StateCreator<
        CreateActionsStore<TContext, TActionId, TPayload>
    > = (set) => ({
        context: null,
        selectedAction: null,
        updateMethods: {
            setContext: (context: TContext | null) => set({ context }),
            setSelectedAction: (actionId: TActionId | null, actionPayload?: TPayload) =>
                set({
                    selectedAction: {
                        actionId,
                        payload: actionPayload || null,
                    },
                }),
            clearSelectedAction: () => set({ selectedAction: null }),
        },
    })

    return createStore<CreateActionsStore<TContext, TActionId, TPayload>>(
        stateCreator
    )
}