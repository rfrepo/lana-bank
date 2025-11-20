import { DEPOSIT_ACCOUNT_ACTION_IDS, DepositAccountActionId } from "../types"

import { DepositAccountStatus } from "@/lib/graphql/generated"

import { ContextMenuItemConfig } from "@/components/context-menu-actions/types"

import { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"


const DEPOSIT_ACCOUNT_DETAILS_PATH = /^\/deposit-accounts\/[^/]+/

export const getContextMenuItemsConfig = <TContext extends DepositAccountData>(): ContextMenuItemConfig<TContext, DepositAccountActionId>[] => {
    const baseConfig = {
        allowedPaths: [DEPOSIT_ACCOUNT_DETAILS_PATH],
        disabledMessageKey: "depositAccountMustBeActive",
        isDisabled: (depositAccount: DepositAccountData): boolean => depositAccount?.status !== DepositAccountStatus.Active,
    }

    return [
        {
            ...baseConfig,
            labelKey: "deposit",
            dataTestId: "create-deposit-button",
            id: DEPOSIT_ACCOUNT_ACTION_IDS.CREATE_DEPOSIT,
        },
        {
            ...baseConfig,
            labelKey: "withdrawal",
            dataTestId: "create-withdrawal-button",
            id: DEPOSIT_ACCOUNT_ACTION_IDS.CREATE_WITHDRAWAL,
        },
    ]
}

