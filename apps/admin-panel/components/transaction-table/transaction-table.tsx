"use client"

import { useMemo, useCallback } from "react"

import type { HistoryNode, TransactionTableProps } from "./types"
import { RendererConfigType } from "./renderer-config"

import DataTable from "@/components/data-table"

export function TransactionTable({
  data,
  rendererConfig,
  columns,
  loading = false,
  emptyMessage,
  navigateTo,
  filter,
  className = "w-full table-fixed",
  headerClassName = "bg-secondary [&_tr:hover]:!bg-secondary",
}: TransactionTableProps) {
  
  const getRenderer = useCallback((entry: HistoryNode) => 
    rendererConfig.type === RendererConfigType.SINGLE 
      ? rendererConfig.renderer 
      : rendererConfig.registry.getRenderer(entry)
  , [rendererConfig])

  const isValidEntry = useCallback((entry: HistoryNode) => 
    rendererConfig.type === RendererConfigType.SINGLE
      ? rendererConfig.renderer.isValidEntry(entry)
      : rendererConfig.registry.isValidEntry(entry)
  , [rendererConfig])

  const validEntries = useMemo(() => {
    let entries = data.filter(isValidEntry)

    if (filter) {
      entries = entries.filter(filter)
    }

    return entries
  }, [data, filter, isValidEntry])

  const defaultNavigateTo = useMemo(() => {
    if (navigateTo) return navigateTo
    
    return (entry: HistoryNode) => {
      const renderer = getRenderer(entry)
      return renderer ? renderer.getNavigationUrl(entry) : null
    }
  }, [navigateTo, getRenderer])

  return (
    <DataTable
      data={validEntries}
      columns={columns}
      emptyMessage={emptyMessage}
      navigateTo={defaultNavigateTo}
      loading={loading}
      className={className}
      headerClassName={headerClassName}
    />
  )
}

