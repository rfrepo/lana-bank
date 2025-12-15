import { PaginatedData } from "@/components/paginated-table"
import {
  DepositAccountHistoryEntryFieldsFragment,
  GetDepositAccountTransactionHistoryQuery,
} from "@/lib/graphql/generated"

export type HistoryNode = DepositAccountHistoryEntryFieldsFragment

export const VALID_ENTRY_TYPES = [
  "DepositEntry",
  "PaymentEntry",
  "DisbursalEntry",
  "WithdrawalEntry",
  "CancelledWithdrawalEntry",
] as const

type DepositAccountFromQuery = Extract<
  NonNullable<GetDepositAccountTransactionHistoryQuery["publicIdTarget"]>,
  { __typename: "DepositAccount" }
>

type HistoryConnection = DepositAccountFromQuery["history"]

export const filterValidEntries = (
  history: HistoryConnection | null,
): HistoryConnection["edges"] => history?.edges.filter(({ node }) => {
  if (!node.__typename) return false
  return VALID_ENTRY_TYPES.some((validType) => validType === node.__typename)
}) ?? []

export const transformHistoryToPaginatedData = (
  history: HistoryConnection | null,
  validEntries: HistoryConnection["edges"],
): PaginatedData<HistoryNode> | undefined =>
  history
    ? {
      pageInfo: {
        ...history.pageInfo,
        endCursor: history.pageInfo.endCursor ?? "",
        startCursor: history.pageInfo.startCursor ?? "",
      },
      edges: validEntries as PaginatedData<HistoryNode>["edges"],
    }
    : undefined

export const getNavigateUrl = (entry: HistoryNode): string | null => {
  switch (entry.__typename) {
    case "DepositEntry": return `/deposits/${entry.deposit.publicId}`
    case "DisbursalEntry": return `/disbursals/${entry.disbursal.publicId}`
    case "WithdrawalEntry":
    case "CancelledWithdrawalEntry": return `/withdrawals/${entry.withdrawal.publicId}`
    default: return null
  }
}
