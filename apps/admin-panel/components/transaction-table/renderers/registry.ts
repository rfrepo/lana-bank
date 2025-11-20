import { DepositEntryRenderer } from "./deposit-entry-renderer"
import { WithdrawalEntryRenderer } from "./withdrawal-entry-renderer"
import { DisbursalEntryRenderer } from "./disbursal-entry-renderer"
import { PaymentEntryRenderer } from "./payment-entry-renderer"
import type { HistoryNode } from "../types"
import type { TransactionEntryRenderer } from "./types"
import { TransactionEntryType } from "./types"

export class TransactionRendererRegistry {
  private renderers: Map<string, TransactionEntryRenderer> = new Map()

  constructor() {
    this.register(TransactionEntryType.DEPOSIT, new DepositEntryRenderer())
    this.register(TransactionEntryType.WITHDRAWAL, new WithdrawalEntryRenderer())
    this.register(TransactionEntryType.CANCELLED_WITHDRAWAL, new WithdrawalEntryRenderer())
    this.register(TransactionEntryType.DISBURSAL, new DisbursalEntryRenderer())
    this.register(TransactionEntryType.PAYMENT, new PaymentEntryRenderer())
  }

  private register(type: string, renderer: TransactionEntryRenderer): void {
    this.renderers.set(type, renderer)
  }

  getRenderer(entry: HistoryNode): TransactionEntryRenderer | null {
    return this.renderers.get(entry.__typename || "") || null
  }

  isValidEntry(entry: HistoryNode): boolean {
    return this.renderers.has(entry.__typename || "")
  }
}

export const transactionRendererRegistry = new TransactionRendererRegistry()

