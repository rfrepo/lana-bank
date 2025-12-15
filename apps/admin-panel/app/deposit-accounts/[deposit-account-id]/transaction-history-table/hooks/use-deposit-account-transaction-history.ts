"use client"

import { useGetDepositAccountTransactionHistoryQuery } from "./gql/deposit-account-transaction-history-query"

import { DEFAULT_PAGESIZE } from "@/components/paginated-table"

export function useDepositAccountTransactionHistory(
  publicId: string,
  first: number = DEFAULT_PAGESIZE,
  after: string | null = null,
) {
  const { data, loading, error, fetchMore } = useGetDepositAccountTransactionHistoryQuery({
    variables: {
      first,
      publicId,
      after: after || undefined,
    },
    fetchPolicy: "no-cache",
  })

  const depositAccount =
    data?.publicIdTarget?.__typename === "DepositAccount" ? data.publicIdTarget : null

  return {
    error,
    loading,
    fetchMore,
    history: depositAccount?.history ?? null,
  }
}
