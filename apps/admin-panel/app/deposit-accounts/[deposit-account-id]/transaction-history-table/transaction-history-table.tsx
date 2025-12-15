"use client"

import React, { useCallback, useMemo } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lana/web/ui/card"

import { useDepositAccountTransactionHistory } from "./hooks/use-deposit-account-transaction-history"
import { createColumns } from "./columns"
import {
  filterValidEntries,
  getNavigateUrl,
  HistoryNode,
  transformHistoryToPaginatedData,
} from "./utils"

import PaginatedTable, { DEFAULT_PAGESIZE } from "@/components/paginated-table"

type DepositAccountTransactionHistoryTableProps = {
  publicId: string
}

const TRANSACTIONS_TABLE_TRANSLATION_KEY = "DepositAccounts.DepositAccountDetails.transactions"

export const DepositAccountTransactionHistoryTable: React.FC<
  DepositAccountTransactionHistoryTableProps
> = ({ publicId }) => {
  const router = useRouter()
  const t = useTranslations(TRANSACTIONS_TABLE_TRANSLATION_KEY)
  const { history, loading, error, fetchMore } = useDepositAccountTransactionHistory(publicId)

  const columns = useMemo(() => createColumns(t), [t])
  
  const onClick = useCallback((entry: HistoryNode) => {
    const url = getNavigateUrl(entry)
    if (url) router.push(url)
    }, [router])
  
  const onFetchMore = useCallback(async (cursor: string) => {
    await fetchMore({ variables: { after: cursor } })
  }, [fetchMore])

  const validEntries = useMemo(() => filterValidEntries(history), [history])

  const data = useMemo(
    () => transformHistoryToPaginatedData(history, validEntries),
    [history, validEntries],
  )

  return error ?
    <div>{error.message}</div> : (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <PaginatedTable<HistoryNode>
            data={data}
            columns={columns}
            loading={loading}
            onClick={onClick}
            fetchMore={onFetchMore}
            pageSize={DEFAULT_PAGESIZE}
            noDataText={t("table.empty")}
            dataTestId="deposit-account-history-table"
          />
        </CardContent>
      </Card>
    )
}