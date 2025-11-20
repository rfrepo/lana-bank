import React from "react"

import type { HistoryNode } from "../types"
import type { TransactionEntryRenderer } from "./types"
import { TransactionEntryType } from "./types"

import { DepositStatusBadge } from "@/app/deposits/status-badge"
import Balance from "@/components/balance/balance"


export class DepositEntryRenderer implements TransactionEntryRenderer {
  renderType(t: (key: string) => string): string {
    return t("table.types.deposit")
  }

  renderAmount(entry: HistoryNode): React.ReactNode {
    if (entry.__typename !== TransactionEntryType.DEPOSIT) return "-"
    return <Balance amount={entry.deposit.amount} currency="usd" />
  }

  renderStatus(entry: HistoryNode): React.ReactNode | null {
    if (entry.__typename !== TransactionEntryType.DEPOSIT) return null
    return <DepositStatusBadge status={entry.deposit.status} />
  }

  getNavigationUrl(entry: HistoryNode): string | null {
    if (entry.__typename !== TransactionEntryType.DEPOSIT) return null
    return `/deposits/${entry.deposit.publicId}`
  }

  isValidEntry(entry: HistoryNode): boolean {
    return entry.__typename === TransactionEntryType.DEPOSIT
  }
}

