"use client"

import { useCallback } from "react"

import { useDepositAccountsQuery, DepositAccount } from "./gql/deposit-accounts-query"

import { DEFAULT_PAGESIZE, PaginatedData } from "@/components/paginated-table"

export function useDepositAccounts() {
  const { data, loading, error, fetchMore } = useDepositAccountsQuery({
    variables: {
      first: DEFAULT_PAGESIZE,
    },
  })

  const handleFetchMore = useCallback(
    async (cursor: string) => {
      await fetchMore({ variables: { after: cursor } })
    },
    [fetchMore],
  )

  const depositAccountsData = data?.depositAccounts as PaginatedData<DepositAccount>

  return {
    loading,
    error,
    data: depositAccountsData,
    fetchMore: handleFetchMore,
  }
}

