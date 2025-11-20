import { useMemo, useCallback } from "react"
import { useTranslations } from "next-intl"

import type { HistoryNode, ColumnConfigOptions } from "../types"
import type { TableRendererConfig } from "../renderer-config"
import { RendererConfigType } from "../renderer-config"

import { compose } from "./compose"
import { DEFAULT_COLUMN_ORDER, type ColumnDeps } from "./types"
import { withDateColumn } from "./builders/with-date-column"
import { withTypeColumn } from "./builders/with-type-column"
import { withAmountColumn } from "./builders/with-amount-column"
import { withStatusColumn } from "./builders/with-status-column"

export function useTransactionColumns(
    options: ColumnConfigOptions,
    rendererConfig: TableRendererConfig
) {
    const t = useTranslations(options.translationNamespace)
    const columnOrder = options.columnOrder || DEFAULT_COLUMN_ORDER

    const getRenderer = useCallback((entry: HistoryNode) =>
        rendererConfig.type === RendererConfigType.SINGLE
            ? rendererConfig.renderer
            : rendererConfig.registry.getRenderer(entry)
        , [rendererConfig])

    const deps: ColumnDeps = useMemo(() => ({
        t,
        options,
        columnOrder,
        getRenderer,
    }), [t, options, columnOrder, getRenderer])

    return useMemo(() => {
        const buildColumns = compose(
            withDateColumn,
            withTypeColumn,
            withAmountColumn,
            withStatusColumn
        )

        return buildColumns(deps, [])
    }, [deps])
}

