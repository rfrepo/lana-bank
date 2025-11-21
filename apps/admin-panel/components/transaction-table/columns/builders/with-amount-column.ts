import type { ColumnBuilder } from "../types"

import { createAmountColumn } from "../create-amount-column"

export const withAmountColumn: ColumnBuilder = (deps, columns) => 
  deps.columnOrder.includes('amount') ? [...columns, createAmountColumn(deps)] : columns

