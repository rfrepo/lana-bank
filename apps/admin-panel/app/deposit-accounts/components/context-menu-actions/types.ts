import type { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"

export const DEPOSIT_ACCOUNT_ACTION_IDS = {
  CREATE_DEPOSIT: "create-deposit",
  CREATE_WITHDRAWAL: "create-withdrawal",
} as const

export type DepositAccountActionId =
  (typeof DEPOSIT_ACCOUNT_ACTION_IDS)[keyof typeof DEPOSIT_ACCOUNT_ACTION_IDS]

export type DepositAccountActionContext = {
  depositAccount: DepositAccountData
}

export type DepositAccountActionEvent = {
  actionId: DepositAccountActionId
  payload?: unknown
}

