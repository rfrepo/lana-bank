import type { HistoryNode } from "../types"

import type { ColumnBuilder } from "./types"

import type { Column } from "@/components/data-table"

export function compose(...builders: ColumnBuilder[]) {
  return (deps: Parameters<ColumnBuilder>[0], initialColumns: Column<HistoryNode>[] = []) => {
    return builders.reduce(
      (columns, builder) => builder(deps, columns),
      initialColumns
    )
  }
}

