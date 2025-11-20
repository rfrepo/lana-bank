import type { ColumnBuilder } from "../types"

import { createStatusColumn } from "../create-status-column"

export const withStatusColumn: ColumnBuilder = (deps, columns) => 
  deps.columnOrder.includes('status') ? [...columns, createStatusColumn(deps)] : columns

