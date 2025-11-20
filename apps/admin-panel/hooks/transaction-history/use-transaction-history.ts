import { useMemo } from "react"
import { gql } from "@apollo/client"

import {
  useGetCustomerTransactionHistoryQuery,
  useGetDepositAccountTransactionHistoryQuery,
} from "@/lib/graphql/generated"
import type { TransactionHistorySource, HistoryNode } from "@/components/transaction-table/types"

gql`
  query GetCustomerTransactionHistory($id: PublicId!, $first: Int!, $after: String) {
    customerByPublicId(id: $id) {
      depositAccount {
        history(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
            hasPreviousPage
            startCursor
          }
          edges {
            cursor
            node {
              __typename
              ... on DepositEntry {
                recordedAt
                deposit {
                  id
                  depositId
                  publicId
                  amount
                  status
                }
              }
              ... on WithdrawalEntry {
                recordedAt
                withdrawal {
                  id
                  withdrawalId
                  publicId
                  amount
                  status
                }
              }
              ... on CancelledWithdrawalEntry {
                recordedAt
                withdrawal {
                  id
                  withdrawalId
                  publicId
                  amount
                  status
                }
              }
              ... on DisbursalEntry {
                recordedAt
                disbursal {
                  id
                  disbursalId
                  publicId
                  amount
                  status
                }
              }
              ... on PaymentEntry {
                recordedAt
                payment {
                  id
                  paymentAllocationId
                  amount
                }
              }
              ... on UnknownEntry {
                recordedAt
              }
            }
          }
        }
      }
    }
  }

  query GetDepositAccountTransactionHistory($publicId: PublicId!, $first: Int!, $after: String) {
    publicIdTarget(id: $publicId) {
      __typename
      ... on DepositAccount {
        history(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
            hasPreviousPage
            startCursor
          }
          edges {
            cursor
            node {
              __typename
              ... on DepositEntry {
                recordedAt
                deposit {
                  id
                  depositId
                  publicId
                  amount
                  status
                }
              }
              ... on WithdrawalEntry {
                recordedAt
                withdrawal {
                  id
                  withdrawalId
                  publicId
                  amount
                  status
                }
              }
              ... on CancelledWithdrawalEntry {
                recordedAt
                withdrawal {
                  id
                  withdrawalId
                  publicId
                  amount
                  status
                }
              }
              ... on DisbursalEntry {
                recordedAt
                disbursal {
                  id
                  disbursalId
                  publicId
                  amount
                  status
                }
              }
              ... on PaymentEntry {
                recordedAt
                payment {
                  id
                  paymentAllocationId
                  amount
                }
              }
              ... on UnknownEntry {
                recordedAt
              }
            }
          }
        }
      }
    }
  }
`

interface UseTransactionHistoryOptions {
  source: TransactionHistorySource
  first?: number
  after?: string
  filter?: (entry: HistoryNode) => boolean
}

interface UseTransactionHistoryReturn {
  data: HistoryNode[]
  loading: boolean
  error: Error | undefined
  hasMore: boolean
  fetchMore: (cursor: string) => Promise<void>
}

const DEFAULT_FIRST = 50

export function useTransactionHistory({
  source,
  first = DEFAULT_FIRST,
  after,
  filter,
}: UseTransactionHistoryOptions): UseTransactionHistoryReturn {
  const customerQuery = useGetCustomerTransactionHistoryQuery({
    variables: { id: source.type === 'customer' ? source.customerId : '', first, after },
    skip: source.type !== 'customer',
    errorPolicy: "all",
  })

  const depositAccountQuery = useGetDepositAccountTransactionHistoryQuery({
    variables: { 
      publicId: source.type === 'depositAccount' ? source.depositAccountId : '', 
      first, 
      after 
    },
    skip: source.type !== 'depositAccount',
    errorPolicy: "all",
  })

  const activeQuery = source.type === 'customer' ? customerQuery : depositAccountQuery

  const historyEntries = useMemo(() => {
    if (source.type === 'customer') {
      const entries = customerQuery.data?.customerByPublicId?.depositAccount?.history.edges.map(
        (edge) => edge.node
      ) || []
      return filter ? entries.filter(filter) : entries
    } else {
      const depositAccount = depositAccountQuery.data?.publicIdTarget?.__typename === 'DepositAccount'
        ? depositAccountQuery.data.publicIdTarget
        : null
      const entries = depositAccount?.history.edges.map((edge) => edge.node) || []
      return filter ? entries.filter(filter) : entries
    }
  }, [source.type, customerQuery.data, depositAccountQuery.data, filter])

  const pageInfo = source.type === 'customer'
    ? customerQuery.data?.customerByPublicId?.depositAccount?.history.pageInfo
    : depositAccountQuery.data?.publicIdTarget?.__typename === 'DepositAccount'
      ? depositAccountQuery.data.publicIdTarget.history.pageInfo
      : undefined

  const fetchMore = async (cursor: string) => {
    if (source.type === 'customer') {
      await customerQuery.fetchMore({ variables: { after: cursor } })
    } else {
      await depositAccountQuery.fetchMore({ variables: { after: cursor } })
    }
  }

  return {
    data: historyEntries,
    loading: activeQuery.loading,
    error: activeQuery.error,
    hasMore: pageInfo?.hasNextPage ?? false,
    fetchMore,
  }
}

export type { UseTransactionHistoryOptions, UseTransactionHistoryReturn }


