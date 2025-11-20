import type { HistoryNode, ColumnConfigOptions } from "../types"
import type { TransactionEntryRenderer } from "../renderers/types"

import type { Column } from "@/components/data-table"

export const DEFAULT_COLUMN_ORDER: Array<'date' | 'type' | 'amount' | 'status'> = [
  'date',
  'type',
  'amount',
  'status',
]

export interface ColumnDeps {
  t: (key: string) => string
  options: ColumnConfigOptions
  columnOrder: Array<'date' | 'type' | 'amount' | 'status'>
  getRenderer: (entry: HistoryNode) => TransactionEntryRenderer | null
}

export type ColumnBuilder = (deps: ColumnDeps, columns: Column<HistoryNode>[]) => Column<HistoryNode>[]

