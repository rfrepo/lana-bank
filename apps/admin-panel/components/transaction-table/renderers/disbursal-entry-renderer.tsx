import React from "react"

import type { HistoryNode } from "../types"
import type { TransactionEntryRenderer } from "./types"
import { TransactionEntryType } from "./types"

import { DisbursalStatusBadge } from "@/app/disbursals/status-badge"
import Balance from "@/components/balance/balance"


export class DisbursalEntryRenderer implements TransactionEntryRenderer {
  renderType(t: (key: string) => string): string {
    return t("table.types.disbursal")
  }

  renderAmount(entry: HistoryNode): React.ReactNode {
    if (entry.__typename !== TransactionEntryType.DISBURSAL) return "-"
    return <Balance amount={entry.disbursal.amount} currency="usd" />
  }

  renderStatus(entry: HistoryNode): React.ReactNode | null {
    if (entry.__typename !== TransactionEntryType.DISBURSAL) return null
    return <DisbursalStatusBadge status={entry.disbursal.status} />
  }

  getNavigationUrl(entry: HistoryNode): string | null {
    if (entry.__typename !== TransactionEntryType.DISBURSAL) return null
    return `/disbursals/${entry.disbursal.publicId}`
  }

  isValidEntry(entry: HistoryNode): boolean {
    return entry.__typename === TransactionEntryType.DISBURSAL
  }
}

