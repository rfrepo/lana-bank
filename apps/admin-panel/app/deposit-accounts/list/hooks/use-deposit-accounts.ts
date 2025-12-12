"use client"

import { useCallback } from "react"

import { DepositAccount, useDepositAccountsQuery } from "@/lib/graphql/generated"

import { DEFAULT_PAGESIZE, PaginatedData } from "@/components/paginated-table"

import "@/app/deposit-accounts/list/hooks/gql/queries" // eslint-disable-line import/no-unassigned-import

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

