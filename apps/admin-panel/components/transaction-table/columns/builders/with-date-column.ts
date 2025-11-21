import type { ColumnBuilder } from "../types"

import { createDateColumn } from "../create-date-column"

export const withDateColumn: ColumnBuilder = (deps, columns) => 
  deps.columnOrder.includes('date') ? [...columns, createDateColumn(deps)] : columns

