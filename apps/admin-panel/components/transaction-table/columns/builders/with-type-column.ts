import type { ColumnBuilder } from "../types"

import { createTypeColumn } from "../create-type-column"

export const withTypeColumn: ColumnBuilder = (deps, columns) => 
  deps.columnOrder.includes('type') ? [...columns, createTypeColumn(deps)] : columns

