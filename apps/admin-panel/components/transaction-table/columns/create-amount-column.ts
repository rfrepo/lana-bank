
import type { HistoryNode } from "../types"

import type { ColumnDeps } from "./types"

import type { Column } from "@/components/data-table"

export function createAmountColumn(deps: ColumnDeps): Column<HistoryNode> {
    return {
        key: "__typename" as const,
        header: deps.t("table.headers.amount"),
        render: (_: HistoryNode["__typename"], entry: HistoryNode) => {
            if (deps.options.customRenderers?.amount) {
                return deps.options.customRenderers.amount(entry)
            }
            const renderer = deps.getRenderer(entry)
            return renderer ? renderer.renderAmount(entry) : "-"
        },
    }
}

