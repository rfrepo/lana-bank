import DateWithTooltip from "@lana/web/components/date-with-tooltip"


import type { HistoryNode } from "../types"

import type { ColumnDeps } from "./types"

import type { Column } from "@/components/data-table"

export function createDateColumn(deps: ColumnDeps): Column<HistoryNode> {
  return {
    key: "__typename" as const,
    header: deps.t("table.headers.date"),
    render: (_: HistoryNode["__typename"], entry: HistoryNode) => {
      if (deps.options.customRenderers?.date) {
        return deps.options.customRenderers.date(entry)
      }
      if (!("recordedAt" in entry) || !entry.recordedAt) return "-"
      return <DateWithTooltip value={entry.recordedAt} />
    },
  }
}

