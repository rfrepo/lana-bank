import React from "react"

import type { HistoryNode } from "../types"
import type { TransactionEntryRenderer } from "./types"
import { TransactionEntryType } from "./types"

import Balance from "@/components/balance/balance"

export class PaymentEntryRenderer implements TransactionEntryRenderer {
  renderType(t: (key: string) => string): string {
    return t("table.types.payment")
  }

  renderAmount(entry: HistoryNode): React.ReactNode {
    if (entry.__typename !== TransactionEntryType.PAYMENT) return "-"
    return <Balance amount={entry.payment.amount} currency="usd" />
  }

  renderStatus(): React.ReactNode | null {
    return null
  }

  getNavigationUrl(): string | null {
    return null
  }

  isValidEntry(entry: HistoryNode): boolean {
    return entry.__typename === TransactionEntryType.PAYMENT
  }
}

