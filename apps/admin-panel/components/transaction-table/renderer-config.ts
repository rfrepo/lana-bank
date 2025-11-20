import { DepositEntryRenderer } from "./renderers/deposit-entry-renderer"
import { WithdrawalEntryRenderer } from "./renderers/withdrawal-entry-renderer"
import { DisbursalEntryRenderer } from "./renderers/disbursal-entry-renderer"
import { PaymentEntryRenderer } from "./renderers/payment-entry-renderer"
import {
  transactionRendererRegistry,
  type TransactionRendererRegistry,
} from "./renderers/registry"
import type { TransactionEntryRenderer } from "./renderers/types"

export const RendererConfigType = {
  SINGLE: 'single',
  MIXED: 'mixed',
} as const

export type RendererConfigType = typeof RendererConfigType[keyof typeof RendererConfigType]

export type TableRendererConfig = 
  | { type: typeof RendererConfigType.SINGLE; renderer: TransactionEntryRenderer }
  | { type: typeof RendererConfigType.MIXED; registry: TransactionRendererRegistry }

export class RendererConfigFactory {
  static forDeposits(): TableRendererConfig {
    return { type: RendererConfigType.SINGLE, renderer: new DepositEntryRenderer() }
  }

  static forWithdrawals(): TableRendererConfig {
    return { type: RendererConfigType.SINGLE, renderer: new WithdrawalEntryRenderer() }
  }

  static forDisbursals(): TableRendererConfig {
    return { type: RendererConfigType.SINGLE, renderer: new DisbursalEntryRenderer() }
  }

  static forPayments(): TableRendererConfig {
    return { type: RendererConfigType.SINGLE, renderer: new PaymentEntryRenderer() }
  }

  static forMixedHistory(): TableRendererConfig {
    return { type: RendererConfigType.MIXED, registry: transactionRendererRegistry }
  }
}

