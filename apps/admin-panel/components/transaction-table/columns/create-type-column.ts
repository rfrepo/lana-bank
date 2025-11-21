
import type { HistoryNode } from "../types"

import type { ColumnDeps } from "./types"

import type { Column } from "@/components/data-table"

export function createTypeColumn(deps: ColumnDeps): Column<HistoryNode> {
  return {
    key: "__typename" as const,
    header: deps.t("table.headers.type"),
    render: (type: HistoryNode["__typename"]) => {
      if (deps.options.customRenderers?.type) {
        return deps.options.customRenderers.type({ __typename: type } as HistoryNode)
      }
      const entry = { __typename: type } as HistoryNode
      const renderer = deps.getRenderer(entry)
      return renderer ? renderer.renderType(deps.t) : "-"
    },
  }
}

