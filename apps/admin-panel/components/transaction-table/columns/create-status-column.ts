
import type { HistoryNode } from "../types"

import type { ColumnDeps } from "./types"

import type { Column } from "@/components/data-table"

export function createStatusColumn(deps: ColumnDeps): Column<HistoryNode> {
    return {
        key: "__typename" as const,
        header: deps.t("table.headers.status"),
        render: (_: HistoryNode["__typename"], entry: HistoryNode) => {
            if (deps.options.customRenderers?.status) {
                return deps.options.customRenderers.status(entry)
            }
            const renderer = deps.getRenderer(entry)
            const status = renderer ? renderer.renderStatus(entry) : null
            return status || "-"
        },
    }
}

