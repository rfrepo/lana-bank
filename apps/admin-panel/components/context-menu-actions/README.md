# Context Menu Actions README

## Overview

The context menu actions system provides a generic, reusable approach to managing create actions across different pages. It replaces the previous monolithic `CreateButton` component with a modular, context-aware solution.

## Improvements Over Previous Implementation

The previous `CreateButton` implementation (`app/create.tsx`) was a single component handling all create actions globally. It had several limitations:

- **Monolithic**: All actions and logic in one large component
- **Hardcoded**: Menu items and paths were hardcoded in the component
- **Context coupling**: Used React context that required manual management
- **No path-based filtering**: Actions appeared on all pages regardless of relevance

The new system addresses these by:

- **Modular**: Each page defines its own actions via configuration
- **Type-safe**: Generic types ensure type safety across implementations
- **Path-aware**: Actions only appear on specified routes
- **Context-aware**: Actions can be disabled based on page data
- **Separation of concerns**: Config, hooks, dialogs, and UI are separated

## Architecture

### Core Components

1. **Store** (`store/context-menu-actions-store.ts`): Zustand store managing:

   - Context data (page-specific data like deposit account)
   - Selected action (which action was clicked)
   - Button props (actions, labels, disabled states)

2. **Button Component** (`components/button.tsx`): Global button that reads from store and renders `CreateActionsButton` or falls back to `CreateButton`

3. **Setup Hook** (`hooks/setup-context-menu-actions/use-setup-context-menu-actions.ts`): Main hook that processes configs and updates the store

4. **Config Types** (`types.ts`): Defines `ContextMenuItemConfig` for action configuration

### How It Works

1. **Page sets context data**: When a page loads, it calls `useSetContextMenuData()` with page-specific data
2. **Page-specific hook**: Calls `useSetupContextMenuActions()` with action configs
3. **Config processing**: Hook filters actions by path, evaluates disabled states, and updates store
4. **Global button**: `ContextMenuCreateActionsButton` reads from store and renders actions
5. **Action selection**: When user clicks an action, store is updated with `selectedAction`
6. **Action handling**: Any component that needs to respond to an action being clicked can read `selectedAction` from the store. Dialogs are a common example, but you could also trigger navigation, API calls, or any other behaviour

## Generic Components

The following components are provided as reusable, generic building blocks:

### Store (`store/context-menu-actions-store.ts`)

Zustand store that manages global state for context menu actions. Provides hooks for:

- `useContextMenuData<T>()`: Read page-specific context data
- `useSetContextMenuData<T>()`: Set page-specific context data
- `useContextMenuSelectedAction<TActionId>()`: Read the currently selected action
- `useSetContextMenuSelectedAction<TActionId>()`: Set the selected action when user clicks
- `useClearContextMenuSelectedAction()`: Clear the selected action
- `useContextMenuButtonProps()`: Read button props (actions, labels, disabled states)
- `useSetContextMenuButtonProps()`: Set button props
- `useClearContextMenuButtonProps()`: Clear button props
- `useContextMenuShouldRender()`: Check if context menu should be rendered

### Button Component (`components/button.tsx`)

`ContextMenuCreateActionsButton` - Global button component that reads from the store. Renders `CreateActionsButton` when context menu actions are available, otherwise falls back to the default `CreateButton`. Used in the app layout header.

### Setup Hook (`hooks/setup-context-menu-actions/use-setup-context-menu-actions.ts`)

`useSetupContextMenuActions` - Main hook that orchestrates the context menu setup. Processes action configs, filters by path, evaluates disabled states, and updates the store with button props. Called by page-specific hooks.

### Create Menu Items Hook (`hooks/create-context-menu-items-from-configs/use-create-context-menu-items-from-configs.ts`)

`useCreateContextMenuItemsFromConfigs` - Transforms action configs into `CreateAction` objects. Handles:

- Filtering actions by allowed paths
- Evaluating disabled states based on context data
- Translating labels and disabled messages
- Creating click handlers
- Determining overall button disabled state

### Should Show Hook (`hooks/should-show-context-menu/use-should-show-context-menu.ts`)

`useShouldShowContextMenu` - Determines if the context menu should be displayed based on whether any configs match the current pathname. Automatically clears button props when the context menu should not be shown.

### Setup UI Props Hook (`hooks/setup-context-menu-actions-ui-props/use-setup-context-menu-actions-ui-props.ts`)

`useSetupContextMenuActionsUIProps` - Syncs button props to the store. Updates the store whenever button props change, ensuring the global button component reflects the current state.

### Types (`types.ts`)

Defines `ContextMenuItemConfig<TContext, TActionId>` - the configuration type for action items. Includes:

- `id`: Unique action identifier
- `labelKey`: Translation key for the action label
- `dataTestId`: Test identifier for the action
- `allowedPaths`: Routes where this action should appear
- `isDisabled`: Function to determine if action is disabled based on context
- `disabledMessageKey`: Translation key for disabled message

### Utils (`utils/context-menu-utils.ts`)

`isPathAllowed` - Utility function that checks if a current pathname matches any of the allowed paths (supports both string and RegExp patterns).

## Implementation Guide

### Step 1: Define Action IDs

Create a types file (e.g., `types.ts`):

```typescript
export const MY_PAGE_ACTION_IDS = {
  CREATE_ITEM: "create-item",
  CREATE_OTHER: "create-other",
} as const

export type MyPageActionId = 
  (typeof MY_PAGE_ACTION_IDS)[keyof typeof MY_PAGE_ACTION_IDS]
```

### Step 2: Create Action Configs

Create a config function (e.g., `my-page-context-menu-items-config.ts`):

```typescript
import { ContextMenuItemConfig } from "@/components/context-menu-actions/types"
import { MyPageData } from "@/hooks/use-my-page"
import { MY_PAGE_ACTION_IDS, MyPageActionId } from "../types"

const MY_PAGE_DETAILS_PATH = /^\/my-page\/[^/]+/

export const getContextMenuItemsConfig = (): 
  ContextMenuItemConfig<MyPageData, MyPageActionId>[] => {
  return [
    {
      id: MY_PAGE_ACTION_IDS.CREATE_ITEM,
      labelKey: "item",
      dataTestId: "create-item-button",
      allowedPaths: [MY_PAGE_DETAILS_PATH],
      isDisabled: (data) => data?.status !== "active",
      disabledMessageKey: "mustBeActive",
    },
  ]
}
```

### Step 3: Create Page-Specific Hook

Create a hook (e.g., `use-my-page-context-menu-actions.ts`):

```typescript
import { useTranslations } from "next-intl"
import { useSetupContextMenuActions } from "@/components/context-menu-actions/hooks/setup-context-menu-actions/use-setup-context-menu-actions"
import { useContextMenuData } from "@/components/context-menu-actions/store/context-menu-actions-store"
import { MyPageData } from "@/hooks/use-my-page"
import { MyPageActionId } from "../types"
import { getContextMenuItemsConfig } from "../my-page-context-menu-items-config"

export const useMyPageContextMenuActions = () => {
  const configs = getContextMenuItemsConfig()
  const contextData = useContextMenuData<MyPageData>()
  const buttonLabel = useTranslations("CreateButton.buttons")("create") as string

  useSetupContextMenuActions<MyPageData, MyPageActionId>({
    configs,
    contextData,
    buttonLabel,
  })
}
```

### Step 4: Create Action Handler Hook

Create a hook for each action handler. Dialogs are a common example, but any component that needs to respond to the selected action can use this pattern (e.g., `use-create-item-dialog.ts`):

```typescript
import {
  useContextMenuData,
  useContextMenuSelectedAction,
  useClearContextMenuSelectedAction,
} from "@/components/context-menu-actions/store/context-menu-actions-store"
import { MY_PAGE_ACTION_IDS, MyPageActionId } from "../../types"
import { MyPageData } from "@/hooks/use-my-page"

export function useCreateItemDialog() {
  const accountContext = useContextMenuData<MyPageData>()
  const selectedAction = useContextMenuSelectedAction<MyPageActionId>()
  const clearAction = useClearContextMenuSelectedAction()
  
  const open = selectedAction?.actionId === MY_PAGE_ACTION_IDS.CREATE_ITEM
  const itemId = accountContext?.id || ""

  return {
    open,
    itemId,
    clearAction,
  }
}
```

### Step 5: Create Action Handler Component

Create the component that responds to the action. This example shows a dialog, but it could be any component that needs to react to the selected action (e.g., `create-item-dialog.tsx`):

```typescript
"use client"

import { Dialog } from "@lana/web/ui/dialog"
import { useCreateItemDialog } from "./hooks/use-create-item-dialog"

export function CreateItemDialog() {
  const { open, itemId, clearAction } = useCreateItemDialog()
  
  return (
    <Dialog open={open && !!itemId} onOpenChange={(isOpen) => {
      if (!isOpen) clearAction()
    }}>
      {/* Dialog content */}
    </Dialog>
  )
}
```

### Step 6: Create Context Menu Component

Create wrapper component (e.g., `my-page-context-menu.tsx`):

```typescript
"use client"

import { useMyPageContextMenuActions } from "../hooks/use-my-page-context-menu-actions"
import { CreateItemDialog } from "../create-item-dialog/create-item-dialog"

export const MyPageContextMenu = () => {
  useMyPageContextMenuActions()

  return (
    <>
      <CreateItemDialog />
    </>
  )
}
```

### Step 7: Integrate in Page

In your page component:

```typescript
"use client"

import { useMyPagePage } from "./hooks/use-my-page-page"
import { MyPageContextMenu } from "../components/context-menu-actions/my-page-context-menu"
import {
  useSetContextMenuData,
  useClearContextMenuButtonProps,
} from "@/components/context-menu-actions/store/context-menu-actions-store"

export function MyPage({ params }) {
  const setContextMenuData = useSetContextMenuData<MyPageData>()
  const clearButtonProps = useClearContextMenuButtonProps()
  
  const { data } = useMyPagePage(params)

  useEffect(() => {
    if (data) {
      setContextMenuData(data)
    }
    return () => {
      clearButtonProps()
      setContextMenuData(null)
    }
  }, [data])

  return (
    <main>
      {/* Page content */}
      <MyPageContextMenu />
    </main>
  )
}
```

## Deposit Account Example

The deposit account page (`app/deposit-accounts/[deposit-account-id]/page.tsx`) demonstrates a complete implementation:

- **Types**: `app/deposit-accounts/components/context-menu-actions/types.ts`
- **Config**: `deposite-account-context-menu-items-config.ts` defines deposit and withdrawal actions
- **Hook**: `use-deposite-account-context-menu-actions.ts` sets up actions
- **Dialogs**: `CreateDepositDialog` and `CreateWithdrawalDialog` handle action execution
- **Integration**: Page sets deposit account data in store, includes `DepositAccountContextActionMenu` component

## Key Concepts

- **Context Data**: Page-specific data stored in the global store (e.g., deposit account, customer)
- **Action Configs**: Define which actions are available, where they appear, and when they're disabled
- **Path Filtering**: Actions only appear on routes matching `allowedPaths`
- **Disabled States**: Actions can be disabled based on context data via `isDisabled` function
- **Selected Action**: When an action is clicked, it's stored in the global store. Any component can read this state and react accordingly—dialogs are a common example, but you could trigger navigation, API calls, or any other behaviour

