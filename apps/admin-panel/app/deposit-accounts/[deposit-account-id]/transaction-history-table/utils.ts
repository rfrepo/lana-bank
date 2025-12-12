import { PaginatedData } from "@/components/paginated-table"
import {
  DepositAccountHistoryEntryFieldsFragment,
  DepositAccountHistoryConnectionFieldsFragment,
} from "@/lib/graphql/generated"

export type HistoryNode = DepositAccountHistoryEntryFieldsFragment

export const VALID_ENTRY_TYPES = [
  "DepositEntry",
  "WithdrawalEntry",
  "CancelledWithdrawalEntry",
  "DisbursalEntry",
  "PaymentEntry",
] as const

type HistoryConnection = DepositAccountHistoryConnectionFieldsFragment

export const filterValidEntries = (
  history: HistoryConnection | null,
): HistoryConnection["edges"] =>
  history?.edges.filter(({ node }) => {
    if (!node.__typename) return false
    return VALID_ENTRY_TYPES.some((validType) => validType === node.__typename)
  }) ?? []

export const transformHistoryToPaginatedData = (
  history: HistoryConnection | null,
  validEntries: HistoryConnection["edges"],
): PaginatedData<HistoryNode> | undefined =>
  history
    ? {
      edges: validEntries as PaginatedData<HistoryNode>["edges"],
      pageInfo: {
        ...history.pageInfo,
        endCursor: history.pageInfo.endCursor ?? "",
        startCursor: history.pageInfo.startCursor ?? "",
      },
    }
    : undefined

export const getNavigateUrl = (entry: HistoryNode): string | null => {
  switch (entry.__typename) {
    case "DepositEntry":
      return `/deposits/${entry.deposit.publicId}`
    case "WithdrawalEntry":
    case "CancelledWithdrawalEntry":
      return `/withdrawals/${entry.withdrawal.publicId}`
    case "DisbursalEntry":
      return `/disbursals/${entry.disbursal.publicId}`
    default:
      return null
  }
}
