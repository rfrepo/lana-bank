import React from "react"

import type { HistoryNode } from "../types"
import type { TransactionEntryRenderer } from "./types"
import { TransactionEntryType } from "./types"

import { WithdrawalStatusBadge } from "@/app/withdrawals/status-badge"
import Balance from "@/components/balance/balance"


export class WithdrawalEntryRenderer implements TransactionEntryRenderer {
  renderType(t: (key: string) => string): string {
    return t("table.types.withdrawal")
  }

  renderAmount(entry: HistoryNode): React.ReactNode {
    if (entry.__typename !== TransactionEntryType.WITHDRAWAL && 
        entry.__typename !== TransactionEntryType.CANCELLED_WITHDRAWAL) {
      return "-"
    }
    return <Balance amount={entry.withdrawal.amount} currency="usd" />
  }

  renderStatus(entry: HistoryNode): React.ReactNode | null {
    if (entry.__typename !== TransactionEntryType.WITHDRAWAL && 
        entry.__typename !== TransactionEntryType.CANCELLED_WITHDRAWAL) {
      return null
    }
    return <WithdrawalStatusBadge status={entry.withdrawal.status} />
  }

  getNavigationUrl(entry: HistoryNode): string | null {
    if (entry.__typename !== TransactionEntryType.WITHDRAWAL && 
        entry.__typename !== TransactionEntryType.CANCELLED_WITHDRAWAL) {
      return null
    }
    return `/withdrawals/${entry.withdrawal.publicId}`
  }

  isValidEntry(entry: HistoryNode): boolean {
    return entry.__typename === TransactionEntryType.WITHDRAWAL || 
           entry.__typename === TransactionEntryType.CANCELLED_WITHDRAWAL
  }
}

