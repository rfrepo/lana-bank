"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"

import { createColumns } from "./columns"
import { ErrorMessage } from "./error-message"

import { useDepositAccounts } from "@/app/deposit-accounts/list/hooks/use-deposit-accounts"

import PaginatedTable, { DEFAULT_PAGESIZE } from "@/components/paginated-table"

import { DepositAccount } from "@/lib/graphql/generated"

const DepositAccountsList = () => {
  const t = useTranslations("DepositAccounts.table")

  const columns = useMemo(() => createColumns(t), [t])

  const { data, loading, error, fetchMore } = useDepositAccounts()

  return (
    <>
      <ErrorMessage error={error} />
      <PaginatedTable<DepositAccount>
        data={data}
        loading={loading}
        columns={columns}
        fetchMore={fetchMore}
        pageSize={DEFAULT_PAGESIZE}
        dataTestId="deposit-account-table"
        navigateTo={(account) => `/deposit-accounts/${account.publicId}`}
      />
    </>
  )
}

export default DepositAccountsList