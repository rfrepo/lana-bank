"use client"

import { gql } from "@apollo/client"

import {
  useGetDepositAccountTransactionHistoryQuery,
} from "@/lib/graphql/generated"

import { DEFAULT_PAGESIZE } from "@/components/paginated-table"
import { DEPOSIT_ACCOUNT_HISTORY_FRAGMENT } from "@/app/deposit-accounts/gql/fragments"

gql`
  query GetDepositAccountTransactionHistory($publicId: PublicId!, $first: Int!, $after: String) {
    publicIdTarget(id: $publicId) {
      __typename
      ... on DepositAccount {
        ...DepositAccountHistoryFields
      }
    }
  }
  ${DEPOSIT_ACCOUNT_HISTORY_FRAGMENT}
`

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