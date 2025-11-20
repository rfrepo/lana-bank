import React from "react"

import type { HistoryNode } from "../types"

export const TransactionEntryType = {
  DEPOSIT: "DepositEntry",
  WITHDRAWAL: "WithdrawalEntry",
  CANCELLED_WITHDRAWAL: "CancelledWithdrawalEntry",
  DISBURSAL: "DisbursalEntry",
  PAYMENT: "PaymentEntry",
} as const

export type TransactionEntryType = typeof TransactionEntryType[keyof typeof TransactionEntryType]

export interface TransactionEntryRenderer {
  renderType: (t: (key: string) => string) => string
  renderAmount: (entry: HistoryNode) => React.ReactNode
  renderStatus: (entry: HistoryNode) => React.ReactNode | null
  getNavigationUrl: (entry: HistoryNode) => string | null
  isValidEntry: (entry: HistoryNode) => boolean
}

